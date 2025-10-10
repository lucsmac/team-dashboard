# Team Report Dashboard

Dashboard moderno e interativo para acompanhamento de times de desenvolvimento, com persistência em banco de dados PostgreSQL via API REST.

## 🚀 Arquitetura

### Stack Completa
- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL
- **API**: REST com suporte completo a CRUD

## 📋 Tabela de Conteúdos

- [Features](#-features)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Setup](#-instalação-e-setup)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Desenvolvimento](#-desenvolvimento)
- [Documentação Adicional](#-documentação-adicional)

## ✨ Features

### 🎯 Interface com Abas
- **Resumo**: Visão executiva com métricas, distribuição do time e próximas entregas
- **Time**: Gerenciamento completo de desenvolvedores (CRUD)
- **Demandas**: Organização por categoria com accordion expansível (CRUD)
- **Highlights**: Entraves, conquistas e informações importantes

### 🔧 Funcionalidades do Sistema
- ✅ **CRUD Completo**: Criar, editar e deletar todas as entidades
- ✅ **Persistência Real**: Dados armazenados em PostgreSQL
- ✅ **API REST**: Backend Express com endpoints organizados
- ✅ **Sincronização Automática**: Atividades dos devs geradas das timeline tasks
- ✅ **Relacionamentos**: Demandas vinculadas a Timeline Tasks
- ✅ **Validação**: Client-side e server-side
- ✅ **Estados de Loading**: Feedback visual durante operações
- ✅ **Confirmações**: Dialogs antes de operações destrutivas
- 📊 **Métricas em Tempo Real**: Calculadas automaticamente
- 🔍 **Filtros e Busca**: Por nome, projeto, categoria
- 🎨 **Dois Modos**: Cards visuais ou tabela detalhada
- 📱 **Responsivo**: Desktop, tablet e mobile

### 🆕 Novos Campos
- **Dev**: `role` (função), `seniority` (senioridade)
- **Demand**: `stage` (etapa: planejamento/desenvolvimento/testes/deploy)
- **TimelineTask**: `deliveryStage` (etapa de entrega), `demandId` (vínculo com demanda)

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** ou **yarn**
- **Git**

### Verificar Instalações

```bash
node --version    # deve ser v18+
npm --version
psql --version    # deve ser 14+
```

## 🚀 Instalação e Setup

### Opção 1: Docker (Recomendado) 🐳

A maneira mais rápida de rodar o projeto completo. Tudo configurado automaticamente!

```bash
# 1. Clone o repositório
git clone <repo-url>
cd team-report

# 2. Copiar variáveis de ambiente
cp .env.docker .env

# 3. Subir todos os containers (PostgreSQL + Backend + Frontend)
docker-compose up -d

# 4. Acessar aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

**Documentação completa**: Ver [DOCKER.md](./DOCKER.md)

### Opção 2: Instalação Manual

### 1. Clone o Repositório

```bash
git clone <repo-url>
cd team-report
```

### 2. Setup do Backend

#### 2.1. Instalar Dependências

```bash
cd backend
npm install
```

#### 2.2. Configurar PostgreSQL

**No Linux/WSL:**
```bash
# Iniciar PostgreSQL
sudo service postgresql start

# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco de dados
CREATE DATABASE team_report;

# Criar usuário (opcional, se não existir)
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE team_report TO seu_usuario;

# Sair
\q
```

**No macOS:**
```bash
# Iniciar PostgreSQL
brew services start postgresql@14

# Criar banco
createdb team_report
```

**No Windows:**
```bash
# Use pgAdmin ou:
psql -U postgres
CREATE DATABASE team_report;
```

#### 2.3. Configurar Variáveis de Ambiente

```bash
# Ainda na pasta backend/
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/team_report"
PORT=5000
NODE_ENV=development
```

**Importante**: Substitua `usuario` e `senha` pelas suas credenciais do PostgreSQL.

#### 2.4. Executar Migrations

```bash
npm run prisma:migrate
```

#### 2.5. Popular Banco com Dados Iniciais (Seed)

```bash
npm run seed
```

#### 2.6. Iniciar Backend

```bash
npm run dev
```

O backend estará rodando em `http://localhost:5000`

### 3. Setup do Frontend

**Em outro terminal**, volte para a raiz do projeto:

```bash
cd ..  # volta para team-report/
```

#### 3.1. Instalar Dependências

```bash
npm install
```

#### 3.2. Configurar Variáveis de Ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` (se necessário):

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.3. Iniciar Frontend

```bash
npm run dev
```

O frontend estará em `http://localhost:5173`

### 4. Verificar Instalação

Acesse `http://localhost:5173` no navegador. Você deve ver:

- ✅ Dashboard carregado
- ✅ Desenvolvedores na aba "Time"
- ✅ Demandas na aba "Demandas"
- ✅ Sem erros no console

## 🏗️ Estrutura do Projeto

```
team-report/
├── backend/                    # API REST + Database
│   ├── prisma/
│   │   ├── schema.prisma      # Modelo do banco de dados
│   │   └── migrations/        # Histórico de migrations
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio (7 controllers)
│   │   ├── routes/            # Definição de rotas (7 routers)
│   │   ├── middleware/        # Error handling, etc
│   │   ├── utils/             # devUtils (sincronização)
│   │   ├── seed.js            # Popular banco
│   │   └── server.js          # Express app
│   ├── .env                   # Variáveis de ambiente
│   ├── package.json
│   └── README.md
│
├── src/                       # Frontend React
│   ├── components/
│   │   ├── ui/               # shadcn/ui (14 componentes)
│   │   ├── dashboard/        # Páginas principais (4 tabs)
│   │   ├── overview/         # Componentes de métricas
│   │   ├── team/             # TeamMemberCard, TeamFilters
│   │   ├── devs/             # DevTable, DevRow, DevForm
│   │   ├── demands/          # DemandCard, DemandForm
│   │   ├── timeline/         # TimelineTaskForm
│   │   ├── deliveries/       # DeliveryCard
│   │   ├── highlights/       # Painéis de highlights
│   │   ├── layout/           # Container, Header
│   │   └── common/           # LoadingSpinner, ErrorMessage
│   ├── context/
│   │   └── DashboardContext.jsx  # State + API calls
│   ├── hooks/
│   │   ├── useDashboardData.js
│   │   └── useEditMode.js
│   ├── services/
│   │   └── api.js            # HTTP client (40+ métodos)
│   ├── utils/
│   │   ├── enums.js          # Constantes (roles, stages, etc)
│   │   ├── colorUtils.js
│   │   └── dataValidation.js
│   ├── data/
│   │   └── initialData.js    # Dados padrão (usado no seed)
│   ├── App.jsx
│   └── index.jsx
│
├── CRUD_UI.md                 # Documentação da interface CRUD
├── IMPLEMENTATION_SUMMARY.md  # Resumo da implementação
├── SYNC_LOGIC.md              # Lógica de sincronização Dev ↔ Task
├── package.json
└── README.md                  # Este arquivo
```

## 🛠️ Tecnologias

### Frontend
- **React 18** - UI library
- **Vite** - Build tool ultra-rápido
- **React Router v7** - Navegação com URL routing
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI modernos
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones SVG

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Prisma ORM** - Type-safe database ORM
- **PostgreSQL** - Banco de dados relacional

### DevOps
- **ESM Modules** - Import/export nativos
- **dotenv** - Variáveis de ambiente
- **nodemon** - Auto-reload no desenvolvimento

## 📖 Uso

### Gerenciar Desenvolvedores

1. Acesse a aba **"Time"**
2. Clique em **"Novo Dev"**
3. Preencha:
   - Nome (obrigatório)
   - Função: Frontend, Backend, Fullstack, etc. (obrigatório)
   - Senioridade: Júnior, Pleno, Sênior, etc. (obrigatório)
   - Cor (opcional)
   - Atividades semanais (opcional - gerado automaticamente)
4. Clique em **"Criar"**

**Editar**: Clique no ícone de lápis no card
**Deletar**: Clique no ícone de lixeira (confirma antes)

### Gerenciar Demandas

1. Acesse a aba **"Demandas"**
2. Clique em **"Nova Demanda"**
3. Preencha:
   - Título (obrigatório)
   - Categoria: 4DX, Redemoinho, etc. (obrigatório)
   - Etapa: Planejamento, Desenvolvimento, Testes, Deploy (obrigatório)
   - Status e Prioridade (obrigatórios)
   - Valor de negócio, Detalhes, Links (opcionais)
   - Desenvolvedores alocados (clique nos chips)
4. Clique em **"Criar"**

**Editar**: Clique no ícone de lápis no card
**Deletar**: Clique no ícone de lixeira

### Vincular Timeline Task a Demanda

Use a API diretamente ou crie componente dedicado (próximo passo):

```bash
curl -X POST http://localhost:5000/api/timeline \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar autenticação",
    "weekType": "current",
    "weekStart": "2025-10-10",
    "assignedDevs": ["Edu"],
    "progress": 50,
    "deliveryStage": "dev",
    "demandId": "d3"
  }'
```

### Sincronização Automática

Os campos `lastWeek`, `thisWeek`, `nextWeek` dos desenvolvedores são **gerados automaticamente** com base nas Timeline Tasks onde eles estão alocados.

**Como funciona:**
- Se o campo estiver vazio → Gera automaticamente
- Se tiver valor manual → Mantém o valor

**Para forçar sincronização:**
- Edite o dev e deixe os campos vazios
- Ou use a API: `PUT /api/devs/:id` com `{ thisWeek: null }`

Veja mais em [SYNC_LOGIC.md](./backend/SYNC_LOGIC.md)

## 🔌 API Endpoints

### Devs
- `GET /api/devs` - Listar todos
- `GET /api/devs/:id` - Buscar por ID (inclui tasks)
- `POST /api/devs` - Criar
- `PUT /api/devs/:id` - Atualizar
- `DELETE /api/devs/:id` - Deletar

### Demands
- `GET /api/demands` - Listar organizadas por categoria
- `GET /api/demands/:id` - Buscar por ID (inclui timeline tasks)
- `POST /api/demands` - Criar
- `PUT /api/demands/:id` - Atualizar
- `DELETE /api/demands/:id` - Deletar

### Timeline Tasks
- `GET /api/timeline` - Listar todas (inclui demand)
- `GET /api/timeline/:id` - Buscar por ID
- `POST /api/timeline` - Criar
- `PUT /api/timeline/:id` - Atualizar
- `DELETE /api/timeline/:id` - Deletar

### Dashboard
- `GET /api/dashboard` - Carrega todos os dados de uma vez

### Outros
- Deliveries, Highlights, Config - Ver [backend/README.md](./backend/README.md)

## 💻 Desenvolvimento

### Scripts do Backend

```bash
cd backend

npm run dev              # Inicia com nodemon (auto-reload)
npm run seed             # Popula banco com dados iniciais
npm run prisma:studio    # Interface visual do banco
npm run prisma:migrate   # Cria/aplica migrations
npm run prisma:generate  # Regenera Prisma Client
```

### Scripts do Frontend

```bash
npm run dev       # Dev server em http://localhost:5173
npm run build     # Build de produção
npm run preview   # Preview do build
```

### Prisma Studio (Explorar Banco)

```bash
cd backend
npm run prisma:studio
```

Acesse `http://localhost:5555` para visualizar/editar dados.

### Adicionar shadcn/ui Components

```bash
npx shadcn@latest add <component-name>

# Exemplo:
npx shadcn@latest add dropdown-menu
```

## 🐛 Troubleshooting

### PostgreSQL não conecta

```bash
# Verificar se está rodando
sudo service postgresql status

# Iniciar se necessário
sudo service postgresql start

# Testar conexão
psql -U seu_usuario -d team_report
```

### Erro "relation does not exist"

```bash
cd backend
npm run prisma:migrate
npm run seed
```

### Frontend não carrega dados

1. Verifique se backend está rodando: `http://localhost:5000/api/dashboard`
2. Verifique console do navegador (F12)
3. Verifique proxy no `vite.config.js`

### Sincronização automática não funciona

- Verifique se `thisWeek`, `lastWeek`, `nextWeek` estão realmente `null` no banco
- Verifique se existem TimelineTasks com o dev em `assignedDevs`
- Veja [SYNC_LOGIC.md](./backend/SYNC_LOGIC.md)

### Porta já em uso

```bash
# Backend (porta 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (porta 5173)
lsof -ti:5173 | xargs kill -9
```

## 📚 Documentação Adicional

- **[DOCKER.md](./DOCKER.md)** - 🐳 Guia completo Docker e Docker Compose
- **[CRUD_UI.md](./CRUD_UI.md)** - Documentação completa da interface CRUD
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Resumo da implementação
- **[backend/SYNC_LOGIC.md](./backend/SYNC_LOGIC.md)** - Lógica de sincronização Dev ↔ Timeline
- **[backend/README.md](./backend/README.md)** - Documentação da API

## 🎨 Estrutura de Dados

### Dev (Desenvolvedor)
```javascript
{
  id: number,
  name: string,
  role: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'qa',
  seniority: 'junior' | 'pleno' | 'senior' | 'especialista' | 'lider',
  color: string,
  lastWeek: string?,   // Auto-gerado se null
  thisWeek: string?,   // Auto-gerado se null
  nextWeek: string?    // Auto-gerado se null
}
```

### Demand (Demanda)
```javascript
{
  id: string,
  category: '4DX' | 'Redemoinho' | 'Stellantis' | 'Projetos Especiais',
  title: string,
  stage: 'planejamento' | 'desenvolvimento' | 'testes' | 'deploy',
  status: 'planejado' | 'em-andamento' | 'concluido' | 'bloqueado',
  priority: 'alta' | 'media' | 'baixa',
  assignedDevs: string[],
  value: string,
  details: string,
  links: string[],
  timelineTasks: TimelineTask[]  // Relação 1:N
}
```

### TimelineTask (Task da Timeline)
```javascript
{
  id: string,
  title: string,
  weekType: 'previous' | 'current' | 'upcoming',
  weekStart: Date,
  assignedDevs: string[],
  progress: number,      // 0-100
  deliveryStage: 'dev' | 'testes' | 'homologacao' | 'deploy',
  deadline: Date?,
  demandId: string?,     // FK opcional
  demand: Demand?        // Relação N:1
}
```

## 🌟 Roadmap

- [ ] Interface completa para Timeline Tasks
- [ ] CRUD para Highlights e Deliveries
- [ ] Toast notifications (substituir `alert()`)
- [ ] Drag & drop para reorganizar tasks
- [ ] Filtros avançados e busca global
- [ ] Export/Import para Excel/CSV
- [ ] Bulk operations (ações em lote)
- [ ] Keyboard shortcuts
- [ ] Dark mode toggle
- [ ] Sistema de permissões/autenticação

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autor

Desenvolvido para o Time Core da Autoforce.

## 🔗 Links Úteis

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express](https://expressjs.com/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Dúvidas?** Abra uma issue ou consulte a documentação adicional em `/docs`.
