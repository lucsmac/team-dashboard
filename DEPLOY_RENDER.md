# Deploy no Render - Guia Completo

Este guia explica como fazer deploy do Team Report Dashboard no Render (gratuito).

## Pré-requisitos

1. Conta no [Render](https://render.com) (pode usar GitHub para login)
2. Repositório no GitHub com o código
3. Git configurado localmente

## Estrutura do Deploy

O Render vai criar 3 recursos:

1. **PostgreSQL Database** (Free tier - permanece ativo)
2. **Backend API** (Free tier - dorme após 15min de inatividade)
3. **Frontend Static Site** (Free tier - sempre disponível)

## Passo a Passo

### 1. Commit e Push do Código

```bash
# Adicione o arquivo render.yaml ao repositório
git add render.yaml DEPLOY_RENDER.md
git commit -m "feat: add Render deployment configuration"
git push origin main
```

### 2. Criar Blueprint no Render

1. Acesse [render.com/dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `team-report`
5. O Render vai detectar automaticamente o `render.yaml`
6. Clique em **"Apply"**

### 3. Aguardar Deploy

O Render vai:
- Criar o banco PostgreSQL
- Fazer deploy do backend (5-10min)
- Fazer deploy do frontend (2-5min)

Acompanhe os logs em tempo real no dashboard.

### 4. Verificar URLs

Após o deploy, você terá:

- Frontend: `https://team-report-frontend.onrender.com`
- Backend: `https://team-report-backend.onrender.com`
- Database: URL de conexão interna

### 5. Ajustar Variáveis de Ambiente (se necessário)

Se o nome dos serviços for diferente, ajuste no dashboard:

**Backend:**
- `DATABASE_URL` → Automaticamente configurado
- `PORT` → 5000 (ou deixe o Render definir)
- `NODE_ENV` → production

**Frontend:**
- `VITE_API_URL` → URL do backend (ex: `https://team-report-backend.onrender.com`)

## Configuração do CORS

O backend precisa permitir requisições do frontend. Edite `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://team-report-frontend.onrender.com' // Adicione a URL do Render
  ],
  credentials: true
}));
```

Depois faça commit e push:

```bash
git add backend/src/server.js
git commit -m "chore: configure CORS for production"
git push origin main
```

O Render vai fazer redeploy automaticamente.

## Limitações do Free Tier

### Backend
- **Dorme após 15min de inatividade** (primeira requisição demora ~30s)
- 750h/mês de execução (suficiente para projetos pessoais)
- 512MB RAM

### Frontend (Static Site)
- **Sempre disponível** (sem sleep)
- 100GB bandwidth/mês
- Deploy instantâneo

### Database (PostgreSQL)
- **Sempre ativa** (não dorme)
- 1GB storage
- Expira após 90 dias (aviso por email para renovar gratuitamente)

## Otimizações para Free Tier

### 1. Manter Backend Ativo (Opcional)

Se quiser evitar o "cold start", crie um job no [cron-job.org](https://cron-job.org):

```
URL: https://team-report-backend.onrender.com/health
Intervalo: A cada 10 minutos
```

**Atenção:** Isso vai consumir suas 750h/mês mais rápido.

### 2. Loading State no Frontend

Adicione um indicador de loading para a primeira requisição (que pode demorar):

```javascript
// frontend/src/services/api.js
const showColdStartWarning = () => {
  console.log('⏳ Backend acordando... pode demorar até 30 segundos');
};
```

## Monitoramento

### Logs

Acesse logs em tempo real:
- Backend: Dashboard → team-report-backend → Logs
- Frontend: Dashboard → team-report-frontend → Logs

### Erros Comuns

**"Build failed" no backend:**
- Verifique se `npx prisma generate` está rodando
- Confirme que `DATABASE_URL` está configurado

**"Build failed" no frontend:**
- Verifique `npm run build` localmente
- Confirme que `VITE_API_URL` está correto

**CORS error:**
- Adicione URL do frontend no backend/src/server.js
- Redeploy do backend

**Database connection error:**
- Aguarde alguns minutos (banco pode estar provisionando)
- Verifique `DATABASE_URL` no backend

## Migrations

Para rodar migrations manualmente:

1. Dashboard → team-report-backend → Shell
2. Execute:
```bash
cd backend
npx prisma migrate deploy
```

## Rollback

Para voltar uma versão:

1. Dashboard → Serviço → Deploy
2. Clique em "Rollback" no deploy anterior

## Custom Domain (Opcional)

Para usar seu próprio domínio:

1. Dashboard → Serviço → Settings → Custom Domain
2. Adicione seu domínio (ex: `team-report.seu-dominio.com`)
3. Configure DNS conforme instruções

## Alternativas ao Free Tier

Se precisar de mais recursos:

- **Render Paid** ($7/mês/serviço) - sem sleep, mais RAM
- **Railway** ($5/mês) - similar ao Render
- **Fly.io** ($5/mês) - boa performance global

## Suporte

Documentação oficial: [render.com/docs](https://docs.render.com)

## Checklist de Deploy

- [ ] Código commitado e no GitHub
- [ ] `render.yaml` na raiz do projeto
- [ ] Blueprint criado no Render
- [ ] Backend deployado com sucesso
- [ ] Frontend deployado com sucesso
- [ ] Database ativa
- [ ] CORS configurado
- [ ] Testado acesso ao frontend
- [ ] Testado comunicação frontend → backend

---

**Dica:** Após o primeiro deploy, todos os próximos deployments são automáticos via push no GitHub!
