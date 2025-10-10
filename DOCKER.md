# 🐳 Docker Setup - Team Report Dashboard

Documentação completa para executar o projeto usando Docker e Docker Compose.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Arquitetura](#arquitetura)
- [Quick Start](#quick-start)
- [Ambientes](#ambientes)
- [Configuração](#configuração)
- [Comandos Úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)
- [Arquivos Docker](#arquivos-docker)

## 🔧 Pré-requisitos

- **Docker** 20.10+ ([Instalar Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([Instalar Docker Compose](https://docs.docker.com/compose/install/))

### Verificar Instalações

```bash
docker --version
# Docker version 20.10.0 ou superior

docker-compose --version
# Docker Compose version 2.0.0 ou superior
```

## 🏗️ Arquitetura

O projeto é dividido em **3 containers Docker**:

```
┌─────────────────────────────────────────┐
│          Docker Compose                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌───────────────┐  │
│  │   Frontend   │   │    Backend    │  │
│  │   (React)    │◄──┤   (Express)   │  │
│  │   Nginx:80   │   │   Port:5000   │  │
│  └──────────────┘   └───────┬───────┘  │
│                             │           │
│                     ┌───────▼────────┐  │
│                     │   PostgreSQL   │  │
│                     │   Port:5432    │  │
│                     └────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Containers

1. **postgres** - PostgreSQL 14 Alpine
   - Banco de dados principal
   - Volume persistente: `postgres_data`
   - Porta: 5432

2. **backend** - Node.js 18 Alpine + Express
   - API REST
   - Prisma ORM
   - Auto migrations + seed
   - Porta: 5000

3. **frontend** - Node.js 18 Alpine + Nginx
   - React + Vite (build)
   - Nginx para servir arquivos estáticos
   - Porta: 80 (produção) ou 5173 (dev)

## 🚀 Quick Start

### Produção (Build Otimizado)

```bash
# 1. Copiar arquivo de ambiente
cp .env.docker .env

# 2. (Opcional) Editar variáveis no .env
nano .env

# 3. Subir todos os containers
docker-compose up -d

# 4. Verificar logs
docker-compose logs -f

# 5. Acessar aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Postgres: localhost:5432
```

### Desenvolvimento (Hot Reload)

```bash
# 1. Copiar arquivo de ambiente
cp .env.docker .env

# 2. Subir em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# 3. Verificar logs
docker-compose -f docker-compose.dev.yml logs -f

# 4. Acessar aplicação
# Frontend: http://localhost:5173 (Vite dev server)
# Backend: http://localhost:5000
```

## 🌍 Ambientes

### 📦 Produção (`docker-compose.yml`)

**Características:**
- Build multi-stage otimizado
- Frontend servido via Nginx
- Backend em modo produção
- Imagens menores e mais eficientes
- Sem volumes de código (apenas node_modules)

**Uso:**
```bash
docker-compose up -d                 # Iniciar
docker-compose down                  # Parar
docker-compose logs -f               # Ver logs
docker-compose ps                    # Status dos containers
```

### 🔨 Desenvolvimento (`docker-compose.dev.yml`)

**Características:**
- Hot reload habilitado (frontend e backend)
- Volumes montados para código-fonte
- Nodemon no backend
- Vite dev server no frontend
- Prisma Studio disponível

**Uso:**
```bash
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml restart frontend
```

## ⚙️ Configuração

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
# PostgreSQL
POSTGRES_USER=teamreport
POSTGRES_PASSWORD=teamreport123
POSTGRES_DB=team_report
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=5000
NODE_ENV=production

# Frontend
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:5000/api
```

### Personalizar Portas

Para mudar as portas expostas, edite o `.env`:

```env
POSTGRES_PORT=15432    # PostgreSQL em porta diferente
BACKEND_PORT=8080      # Backend em porta 8080
FRONTEND_PORT=8000     # Frontend em porta 8000
```

Depois recrie os containers:

```bash
docker-compose down
docker-compose up -d
```

### Variáveis de Ambiente Importantes

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `POSTGRES_USER` | Usuário do PostgreSQL | `teamreport` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `teamreport123` |
| `POSTGRES_DB` | Nome do banco | `team_report` |
| `BACKEND_PORT` | Porta da API | `5000` |
| `FRONTEND_PORT` | Porta do frontend | `3000` (prod) / `5173` (dev) |
| `NODE_ENV` | Ambiente Node | `production` / `development` |
| `VITE_API_URL` | URL da API para frontend | `http://localhost:5000/api` |

## 🛠️ Comandos Úteis

### Gerenciar Containers

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados!)
docker-compose down -v

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Reiniciar um serviço específico
docker-compose restart backend

# Verificar status
docker-compose ps

# Executar comando em container rodando
docker-compose exec backend sh
docker-compose exec postgres psql -U teamreport -d team_report
```

### Build e Rebuild

```bash
# Rebuild de todos os serviços
docker-compose build

# Rebuild forçado (sem cache)
docker-compose build --no-cache

# Rebuild de um serviço específico
docker-compose build backend

# Rebuild e restart
docker-compose up -d --build
```

### Database Operations

```bash
# Acessar PostgreSQL
docker-compose exec postgres psql -U teamreport -d team_report

# Executar migrations manualmente
docker-compose exec backend npx prisma migrate deploy

# Rodar seed manualmente
docker-compose exec backend npm run seed

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio
# Acesse: http://localhost:5555

# Backup do banco
docker-compose exec postgres pg_dump -U teamreport team_report > backup.sql

# Restaurar banco
cat backup.sql | docker-compose exec -T postgres psql -U teamreport -d team_report
```

### Monitoramento

```bash
# Ver uso de recursos
docker stats

# Ver containers em execução
docker ps

# Inspecionar container
docker inspect team-report-backend

# Ver logs em tempo real
docker-compose logs -f --tail=100
```

### Limpeza

```bash
# Remover containers parados
docker-compose down

# Remover containers, redes e volumes
docker-compose down -v

# Limpar tudo do Docker (CUIDADO!)
docker system prune -a

# Limpar apenas volumes não usados
docker volume prune

# Limpar apenas imagens não usadas
docker image prune -a
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Verificar se portas estão em uso
lsof -ti:5000    # Backend
lsof -ti:3000    # Frontend
lsof -ti:5432    # PostgreSQL

# Rebuild forçado
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Erro "Port already in use"

```bash
# Matar processo na porta
lsof -ti:5000 | xargs kill -9

# Ou mudar porta no .env
BACKEND_PORT=8080
```

### Migrations não aplicadas

```bash
# Executar migrations manualmente
docker-compose exec backend npx prisma migrate deploy

# Regenerar Prisma Client
docker-compose exec backend npx prisma generate
```

### Dados não persistem

Verifique se o volume foi criado:

```bash
docker volume ls | grep team-report

# Se não existir, crie manualmente
docker volume create team-report_postgres_data
```

### Frontend não conecta no backend

1. Verifique `VITE_API_URL` no `.env`
2. Verifique se backend está rodando:
   ```bash
   curl http://localhost:5000/api/dashboard
   ```
3. Verifique logs do backend:
   ```bash
   docker-compose logs backend
   ```

### Permissões no PostgreSQL

```bash
# Entrar no container
docker-compose exec postgres sh

# Verificar permissões
psql -U teamreport -d team_report -c "\du"

# Conceder permissões
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE team_report TO teamreport;"
```

### Hot Reload não funciona (Dev Mode)

Verifique se os volumes estão montados:

```bash
docker-compose -f docker-compose.dev.yml config

# Deve mostrar volumes como:
# volumes:
#   - ./backend:/app
#   - /app/node_modules
```

### Erro Prisma "Could not locate Query Engine" (Alpine Linux)

**Sintoma:**
```
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x"
```

**Causa:**
Docker usa Alpine Linux (musl libc), mas Prisma Client foi gerado para Debian/Ubuntu (glibc).

**Solução:**

1. **Adicionar binaryTargets ao schema.prisma** (já corrigido):
   ```prisma
   generator client {
     provider      = "prisma-client-js"
     binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
   }
   ```

2. **Regenerar Prisma Client localmente:**
   ```bash
   cd backend
   npx prisma generate
   ```

3. **Rebuild containers Docker:**
   ```bash
   docker-compose down
   docker-compose build --no-cache backend
   docker-compose up -d
   ```

**Para desenvolvimento:**
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build --no-cache backend
docker-compose -f docker-compose.dev.yml up -d
```

**Nota:** Os Dockerfiles já foram ajustados para copiar o schema.prisma antes de gerar o Prisma Client, garantindo os binários corretos.

## 📁 Arquivos Docker

### `docker-compose.yml`
Configuração de produção com 3 serviços:
- PostgreSQL com healthcheck
- Backend com migrations automáticas
- Frontend com Nginx

### `docker-compose.dev.yml`
Configuração de desenvolvimento com:
- Volumes montados para hot reload
- Nodemon no backend
- Vite dev server no frontend

### `Dockerfile` (frontend)
Multi-stage build:
- Stage 1: Build da aplicação React
- Stage 2: Nginx servindo arquivos estáticos

### `Dockerfile.dev` (frontend)
Imagem para desenvolvimento com Vite dev server

### `backend/Dockerfile`
Imagem de produção:
- Node 18 Alpine
- Apenas dependências de produção
- Prisma Client gerado

### `backend/Dockerfile.dev`
Imagem para desenvolvimento:
- Todas as dependências
- Nodemon para hot reload

### `nginx.conf`
Configuração do Nginx:
- Suporte a React Router
- Gzip compression
- Cache de assets estáticos
- Security headers

### `.dockerignore`
Arquivos ignorados no build:
- node_modules
- .env
- .git
- logs
- documentação

## 🔐 Segurança

### Produção

**IMPORTANTE**: Em produção, sempre:

1. **Mude as senhas padrão**:
   ```env
   POSTGRES_PASSWORD=senhaForteAqui123!@#
   ```

2. **Use secrets do Docker**:
   ```yaml
   secrets:
     db_password:
       file: ./secrets/db_password.txt
   ```

3. **Não exponha portas desnecessárias**:
   ```yaml
   # Remova o mapeamento de porta do PostgreSQL
   # ports:
   #   - "5432:5432"
   ```

4. **Use variáveis de ambiente seguras**:
   ```bash
   # Não commite o .env
   echo ".env" >> .gitignore
   ```

## 🚀 Deploy

### Deploy em servidor

```bash
# 1. Clonar repositório no servidor
git clone <repo-url>
cd team-report

# 2. Configurar variáveis
cp .env.docker .env
nano .env

# 3. Subir containers
docker-compose up -d

# 4. Verificar logs
docker-compose logs -f

# 5. Acessar aplicação
# Frontend: http://seu-servidor:3000
```

### Deploy com Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/team-report
server {
    listen 80;
    server_name team-report.exemplo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### Deploy com SSL (Let's Encrypt)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d team-report.exemplo.com
```

## 📊 Monitoramento

### Docker Stats

```bash
# Ver uso de recursos em tempo real
docker stats
```

### Logs Centralizados

```bash
# Exportar logs para arquivo
docker-compose logs > logs.txt

# Ver últimas 100 linhas
docker-compose logs --tail=100

# Seguir logs em tempo real
docker-compose logs -f
```

### Health Checks

```bash
# Frontend
curl http://localhost:3000/health

# Backend
curl http://localhost:5000/api/dashboard

# PostgreSQL
docker-compose exec postgres pg_isready -U teamreport
```

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Nginx Docker](https://hub.docker.com/_/nginx)

---

**Dúvidas?** Abra uma issue ou consulte a [documentação principal](./README.md).
