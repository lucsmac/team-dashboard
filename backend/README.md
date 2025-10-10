# Team Report Dashboard

Dashboard interativo para gerenciamento de equipe, demandas e entregas. Construído com React + Express + PostgreSQL.

## Stack Tecnológica

### Frontend
- **React** 18 + Vite
- **React Router** v7 - Navegação
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Backend
- **Node.js** + Express
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados

## Setup Completo

### Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** 14+
  - OU **Docker** para rodar Postgres em container

### 1. Configurar PostgreSQL

**Opção A: PostgreSQL via Docker (recomendado)**

\`\`\`bash
docker run --name team-report-db \\
  -e POSTGRES_PASSWORD=postgres \\
  -e POSTGRES_DB=team_report \\
  -p 5432:5432 \\
  -d postgres:15
\`\`\`

**Opção B: PostgreSQL instalado**

Crie um banco de dados: \`CREATE DATABASE team_report;\`

### 2. Configurar Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Editar .env com credenciais do PostgreSQL
\`\`\`

### 3. Executar Migrations e Seed

\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
\`\`\`

### 4. Configurar Frontend

\`\`\`bash
cd ..
npm install
\`\`\`

### 5. Iniciar Aplicação

**Terminal 1 - Backend:**
\`\`\`bash
cd backend && npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm run dev
\`\`\`

Acesse: \`http://localhost:5173\`

## Documentação

- Backend: \`backend/README.md\`
- API Endpoints: Ver backend README

## Troubleshooting

Ver seção completa no README do backend.

