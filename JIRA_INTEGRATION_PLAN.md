# 🔗 Plano de Integração Jira - Versão Simplificada

## 🎯 Objetivos

1. **Alocação Semanal**: Indicar se dev está em Genius, Service Desk ou Roadmap na semana
2. **Integração Jira**: Conectar com boards de Service Desk e Genius via API
3. **Métricas Históricas**: Coletar e armazenar dados para análise temporal

---

## 📋 FUNCIONALIDADE 1: Alocação Semanal do Dev

### **1.1 Modelo de Dados**

#### Atualizar tabela `Dev`
```prisma
model Dev {
  id            Int                      @id @default(autoincrement())
  name          String
  color         String
  role          String
  seniority     String
  lastWeek      String?                  @map("last_week")
  thisWeek      String?                  @map("this_week")
  nextWeek      String?                  @map("next_week")

  // NOVOS CAMPOS
  weeklyCapacity Int                     @default(40)  // Horas semanais disponíveis

  createdAt     DateTime                 @default(now()) @map("created_at")
  updatedAt     DateTime                 @updatedAt @map("updated_at")
  timelineTasks TimelineTaskAssignment[]
  weekAllocations DevWeekAllocation[]  // NOVO RELACIONAMENTO

  @@index([role])
  @@index([seniority])
  @@map("devs")
}
```

#### Nova tabela: `DevWeekAllocation`
```prisma
model DevWeekAllocation {
  id              String   @id @default(uuid())
  devId           Int      @map("dev_id")
  weekStart       DateTime @map("week_start")
  weekEnd         DateTime @map("week_end")
  allocationType  String   @map("allocation_type")  // 'roadmap' | 'service-desk' | 'genius'
  allocationPercent Int    @default(100)            // Percentual da semana (0-100)
  notes           String?

  dev             Dev      @relation(fields: [devId], references: [id], onDelete: Cascade)

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@unique([devId, weekStart]) // Um dev só pode ter uma alocação por semana
  @@index([devId])
  @@index([weekStart])
  @@index([allocationType])
  @@map("dev_week_allocations")
}
```

**Exemplo de dados**:
```javascript
// Dev "João" na semana de 14-20 Out está 100% em Service Desk
{
  devId: 1,
  weekStart: '2025-10-14',
  weekEnd: '2025-10-20',
  allocationType: 'service-desk',
  allocationPercent: 100
}

// Dev "Maria" na semana de 14-20 Out está 50% Roadmap + 50% Genius
// Criar 2 registros:
{
  devId: 2,
  weekStart: '2025-10-14',
  weekEnd: '2025-10-20',
  allocationType: 'roadmap',
  allocationPercent: 50
}
{
  devId: 2,
  weekStart: '2025-10-14',
  weekEnd: '2025-10-20',
  allocationType: 'genius',
  allocationPercent: 50
}
```

### **1.2 Backend - Endpoints**

```javascript
// backend/src/routes/devAllocations.js

// Listar alocações de uma semana específica
GET /api/dev-allocations?weekStart=2025-10-14

// Obter alocação de um dev específico em uma semana
GET /api/dev-allocations/dev/:devId/week/:weekStart

// Criar/atualizar alocação
POST /api/dev-allocations
Body: {
  devId: 1,
  weekStart: '2025-10-14',
  weekEnd: '2025-10-20',
  allocationType: 'service-desk',
  allocationPercent: 100
}

// Deletar alocação
DELETE /api/dev-allocations/:id

// Obter histórico de alocações de um dev (últimos 3 meses)
GET /api/dev-allocations/dev/:devId/history
```

### **1.3 Frontend - Interface**

#### **Componente: `DevAllocationManager.jsx`**
Adicionar à página de **Time** ou criar nova aba **"Alocação"**.

**Features**:
- Calendário semanal (grid de semanas)
- Linha por dev
- Células editáveis: clicar e selecionar tipo de alocação
- Cores:
  - 🔵 Azul: Roadmap
  - 🟠 Laranja: Service Desk
  - 🟢 Verde: Genius
  - ⚪ Cinza: Férias/Ausente
- Tooltip mostra percentual (se for alocação parcial)

**Exemplo visual**:
```
             | Sem 14-20 Out | Sem 21-27 Out | Sem 28-03 Nov |
-------------|---------------|---------------|---------------|
João         |  🟠 SD 100%   |  🔵 Roadmap   |  🟢 Genius    |
Maria        |  🔵 Roadmap   |  🟠 SD 50%    |  🔵 Roadmap   |
             |               |  🔵 Road 50%  |               |
Pedro        |  🟢 Genius    |  ⚪ Férias    |  🟢 Genius    |
```

#### **Modal de Edição**
Ao clicar em uma célula:
```javascript
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Alocação de {devName}</DialogTitle>
      <DialogDescription>Semana de {weekStart} a {weekEnd}</DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      {/* Botões de tipo */}
      <div className="flex gap-2">
        <Button
          variant={allocationType === 'roadmap' ? 'default' : 'outline'}
          onClick={() => setAllocationType('roadmap')}
        >
          🔵 Roadmap
        </Button>
        <Button
          variant={allocationType === 'service-desk' ? 'default' : 'outline'}
          onClick={() => setAllocationType('service-desk')}
        >
          🟠 Service Desk
        </Button>
        <Button
          variant={allocationType === 'genius' ? 'default' : 'outline'}
          onClick={() => setAllocationType('genius')}
        >
          🟢 Genius
        </Button>
      </div>

      {/* Slider de percentual (se quiser alocação parcial) */}
      <div>
        <Label>Percentual de Alocação: {allocationPercent}%</Label>
        <Slider
          value={[allocationPercent]}
          onValueChange={(val) => setAllocationPercent(val[0])}
          min={0}
          max={100}
          step={25}
        />
      </div>

      {/* Campo de notas */}
      <Textarea
        placeholder="Notas (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>

    <DialogFooter>
      <Button onClick={handleSave}>Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **1.4 Integração com Overview**

No `OverviewPage.jsx`, adicionar card:

```javascript
// Card: Alocação do Time Esta Semana
{
  title: "Alocação do time",
  content: (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>🔵 Roadmap</span>
        <span className="font-bold">{roadmapCount} devs</span>
      </div>
      <div className="flex justify-between">
        <span>🟠 Service Desk</span>
        <span className="font-bold">{serviceDeskCount} devs</span>
      </div>
      <div className="flex justify-between">
        <span>🟢 Genius</span>
        <span className="font-bold">{geniusCount} devs</span>
      </div>
    </div>
  )
}
```

---

## 📋 FUNCIONALIDADE 2: Integração com Jira

### **2.1 Configuração da Integração Jira**

#### Nova tabela: `JiraIntegration`
```prisma
model JiraIntegration {
  id            String   @id @default(uuid())
  name          String                          // 'Service Desk' | 'Genius'
  jiraUrl       String                          // https://autoforce.atlassian.net
  projectKey    String                          // Ex: 'SD', 'GEN'
  boardId       String                          // ID do board no Jira
  apiToken      String                          // Token de autenticação (criptografado)
  email         String                          // Email da conta Jira

  isActive      Boolean  @default(true)
  lastSyncAt    DateTime?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("jira_integrations")
}
```

#### Nova tabela: `JiraIssue` (Cache local dos tickets)
```prisma
model JiraIssue {
  id                String   @id @default(uuid())

  // Identificação Jira
  jiraIssueId       String   @unique                 // Ex: 'SD-123'
  jiraIssueKey      String   @unique                 // Ex: 'SD-123'
  integrationName   String                           // 'Service Desk' | 'Genius'

  // Dados do ticket
  summary           String
  description       String?
  issueType         String                           // 'Bug', 'Task', 'Story', etc
  status            String                           // 'To Do', 'In Progress', 'Done'
  priority          String?                          // 'Highest', 'High', 'Medium', 'Low'

  // Atribuição
  assigneeEmail     String?
  assigneeName      String?
  assignedDevId     Int?                             // FK para Dev (se conseguir mapear)

  // Datas (extraídas do Jira)
  createdAt         DateTime
  updatedAt         DateTime
  resolutionDate    DateTime?

  // Tempo (extraído do Jira - em minutos)
  timeToFirstResponse Int?                          // Tempo até primeiro comentário
  timeInProgress      Int?                          // Tempo em 'In Progress'
  timeToResolution    Int?                          // Tempo até 'Done'

  // Estimativas (se houver no Jira)
  estimatedHours    Float?
  loggedHours       Float?

  // Complexidade (inferida ou custom field)
  complexity        String?                          // 'rapida' | 'normal' | 'demorada'
  storyPoints       Int?

  // Metadados
  labels            String[]
  components        String[]

  // Sincronização
  lastSyncedAt      DateTime @default(now())

  @@index([integrationName])
  @@index([status])
  @@index([assigneeEmail])
  @@index([assignedDevId])
  @@index([createdAt])
  @@index([resolutionDate])
  @@map("jira_issues")
}
```

### **2.2 Backend - Serviço de Integração Jira**

#### **Arquivo: `backend/src/services/jiraService.js`**

```javascript
import fetch from 'node-fetch';

/**
 * Cliente Jira REST API v3
 * Docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
 */
class JiraService {
  constructor(jiraUrl, email, apiToken) {
    this.jiraUrl = jiraUrl;
    this.auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
  }

  async request(endpoint, options = {}) {
    const url = `${this.jiraUrl}/rest/api/3${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Buscar issues de um board com filtros
   */
  async getBoardIssues(boardId, options = {}) {
    const {
      startDate,    // ISO string
      endDate,      // ISO string
      status,       // 'To Do', 'In Progress', 'Done'
      assignee,     // email do usuário
      maxResults = 100
    } = options;

    // Construir JQL (Jira Query Language)
    let jql = `project = ${boardId}`;

    if (startDate) {
      jql += ` AND created >= '${startDate}'`;
    }
    if (endDate) {
      jql += ` AND created <= '${endDate}'`;
    }
    if (status) {
      jql += ` AND status = '${status}'`;
    }
    if (assignee) {
      jql += ` AND assignee = '${assignee}'`;
    }

    // Buscar issues
    const result = await this.request(`/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`);

    return result.issues;
  }

  /**
   * Obter changelog de uma issue (para calcular tempo em cada status)
   */
  async getIssueChangelog(issueKey) {
    const result = await this.request(`/issue/${issueKey}?expand=changelog`);
    return result.changelog.histories;
  }

  /**
   * Calcular tempo até primeira resposta (primeiro comentário)
   */
  async getTimeToFirstResponse(issueKey, createdAt) {
    const comments = await this.request(`/issue/${issueKey}/comment`);

    if (comments.comments.length === 0) {
      return null;
    }

    const firstComment = comments.comments[0];
    const firstResponseAt = new Date(firstComment.created);
    const created = new Date(createdAt);

    return Math.floor((firstResponseAt - created) / 1000 / 60); // minutos
  }

  /**
   * Calcular tempo em um status específico
   */
  async getTimeInStatus(issueKey, targetStatus) {
    const changelog = await this.getIssueChangelog(issueKey);

    let timeInStatus = 0;
    let enteredAt = null;

    for (const history of changelog) {
      const statusChange = history.items.find(item => item.field === 'status');

      if (!statusChange) continue;

      // Entrou no status
      if (statusChange.toString === targetStatus) {
        enteredAt = new Date(history.created);
      }

      // Saiu do status
      if (statusChange.fromString === targetStatus && enteredAt) {
        const exitedAt = new Date(history.created);
        timeInStatus += (exitedAt - enteredAt) / 1000 / 60; // minutos
        enteredAt = null;
      }
    }

    // Ainda está no status
    if (enteredAt) {
      timeInStatus += (new Date() - enteredAt) / 1000 / 60;
    }

    return Math.floor(timeInStatus);
  }

  /**
   * Buscar velocity de um sprint
   */
  async getSprintVelocity(boardId, sprintId) {
    const sprint = await this.request(`/sprint/${sprintId}`);
    const issues = await this.request(`/board/${boardId}/sprint/${sprintId}/issue`);

    const completedIssues = issues.issues.filter(i => i.fields.status.name === 'Done');
    const totalPoints = completedIssues.reduce((sum, i) => sum + (i.fields.customfield_10016 || 0), 0); // Story Points

    return {
      sprintName: sprint.name,
      totalIssues: issues.issues.length,
      completedIssues: completedIssues.length,
      totalPoints,
      completionRate: (completedIssues.length / issues.issues.length) * 100
    };
  }

  /**
   * Obter métricas do board (backlog size, etc)
   */
  async getBoardMetrics(boardId) {
    // Issues no backlog
    const backlog = await this.request(`/board/${boardId}/backlog?maxResults=1000`);

    // Issues em progresso
    const inProgress = await this.getBoardIssues(boardId, { status: 'In Progress' });

    // Issues concluídas esta semana
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const completed = await this.getBoardIssues(boardId, {
      status: 'Done',
      startDate: weekStart.toISOString()
    });

    return {
      backlogSize: backlog.issues.length,
      inProgressCount: inProgress.length,
      completedThisWeek: completed.length
    };
  }
}

export default JiraService;
```

### **2.3 Backend - Endpoints de Integração**

```javascript
// backend/src/routes/jiraIntegration.js

// Configurar integração
POST /api/jira/integrations
Body: {
  name: 'Service Desk',
  jiraUrl: 'https://autoforce.atlassian.net',
  projectKey: 'SD',
  boardId: '12345',
  apiToken: 'your-api-token',
  email: 'dev@autoforce.com'
}

// Listar integrações
GET /api/jira/integrations

// Testar conexão com Jira
GET /api/jira/integrations/:id/test

// Sincronizar issues de um board (manual ou via cron)
POST /api/jira/integrations/:id/sync
Query params:
  - startDate (opcional)
  - endDate (opcional)

// Obter issues sincronizadas
GET /api/jira/issues?integration=service-desk&status=Done&weekStart=2025-10-14

// Obter métricas do board
GET /api/jira/integrations/:id/metrics

// Obter velocity de um dev
GET /api/jira/metrics/dev/:devId?startDate=2025-10-01&endDate=2025-10-15

// Obter análise de complexidade (tempo médio por tipo de issue)
GET /api/jira/metrics/complexity-analysis?integration=genius
```

### **2.4 Backend - Job de Sincronização Automática**

```javascript
// backend/src/jobs/jiraSyncJob.js

import cron from 'node-cron';
import prisma from '../generated/prisma/index.js';
import JiraService from '../services/jiraService.js';

/**
 * Roda a cada 30 minutos
 */
cron.schedule('*/30 * * * *', async () => {
  console.log('[Jira Sync] Iniciando sincronização...');

  try {
    const integrations = await prisma.jiraIntegration.findMany({
      where: { isActive: true }
    });

    for (const integration of integrations) {
      const jira = new JiraService(
        integration.jiraUrl,
        integration.email,
        integration.apiToken
      );

      // Buscar issues dos últimos 7 dias
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const issues = await jira.getBoardIssues(integration.boardId, {
        startDate: weekAgo.toISOString()
      });

      // Salvar/atualizar no banco
      for (const issue of issues) {
        await prisma.jiraIssue.upsert({
          where: { jiraIssueKey: issue.key },
          create: {
            jiraIssueId: issue.id,
            jiraIssueKey: issue.key,
            integrationName: integration.name,
            summary: issue.fields.summary,
            description: issue.fields.description,
            issueType: issue.fields.issuetype.name,
            status: issue.fields.status.name,
            priority: issue.fields.priority?.name,
            assigneeEmail: issue.fields.assignee?.emailAddress,
            assigneeName: issue.fields.assignee?.displayName,
            createdAt: new Date(issue.fields.created),
            updatedAt: new Date(issue.fields.updated),
            resolutionDate: issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null,
            labels: issue.fields.labels,
            lastSyncedAt: new Date()
          },
          update: {
            status: issue.fields.status.name,
            updatedAt: new Date(issue.fields.updated),
            resolutionDate: issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null,
            lastSyncedAt: new Date()
          }
        });
      }

      // Atualizar lastSyncAt da integração
      await prisma.jiraIntegration.update({
        where: { id: integration.id },
        data: { lastSyncAt: new Date() }
      });

      console.log(`[Jira Sync] ${integration.name}: ${issues.length} issues sincronizadas`);
    }

    console.log('[Jira Sync] Concluído!');
  } catch (error) {
    console.error('[Jira Sync] Erro:', error);
  }
});
```

---

## 📋 FUNCIONALIDADE 3: Métricas e Análise Histórica

### **3.1 Nova Página: "Análise de Suporte"**

Rota: `/support-analytics`

#### **Componente: `SupportAnalyticsPage.jsx`**

**Seções**:

1. **Filtros Globais** (topo)
   - Período: Dropdown (Última semana, Últimas 2 semanas, Último mês, Últimos 3 meses, Customizado)
   - Integração: Service Desk, Genius, Ambas
   - Dev: Dropdown com todos os devs

2. **Cards de Métricas**
   ```javascript
   - Total de Tickets Resolvidos
   - Tempo Médio de Resolução (em horas)
   - Taxa de Resolução no SLA
   - Backlog Atual (issues abertas)
   ```

3. **Gráfico: Volume por Semana**
   - Eixo X: Semanas
   - Eixo Y: Quantidade de tickets
   - Linhas separadas: Service Desk (🟠) e Genius (🟢)

4. **Gráfico: Distribuição de Complexidade**
   - Gráfico de pizza ou barras
   - Análise automática:
     - Rápida: <2h de resolução
     - Normal: 2h-8h
     - Demorada: >8h

5. **Tabela: Performance por Dev**
   | Dev | Tickets Resolvidos | Tempo Médio | Taxa SLA | Velocidade (tickets/dia) |
   |-----|-------------------|-------------|----------|--------------------------|
   | João | 45 | 3.2h | 92% | 2.3 |
   | Maria | 38 | 2.8h | 95% | 1.9 |

   - Ordenável por qualquer coluna
   - Filtro por período

6. **Análise de Tickets Demorados**
   - Lista dos 10 tickets mais demorados
   - Campos: ID, Título, Tempo de Resolução, Dev, Motivo (se preenchido)
   - Botão "Marcar como Outlier" (para excluir de médias futuras)

7. **Tendência de Velocidade**
   - Gráfico de linha: Velocidade média do time ao longo do tempo
   - Detecta melhorias ou degradações
   - **Insight**: "Velocidade aumentou 15% nas últimas 4 semanas"

### **3.2 Backend - Endpoints de Analytics**

```javascript
// Análise de complexidade (tempo médio por faixa)
GET /api/jira/analytics/complexity?integration=service-desk&startDate=2025-09-01&endDate=2025-10-15
Response:
{
  rapida: { count: 120, avgTimeMinutes: 45, percentage: 60 },
  normal: { count: 50, avgTimeMinutes: 180, percentage: 25 },
  demorada: { count: 30, avgTimeMinutes: 480, percentage: 15 }
}

// Performance por dev
GET /api/jira/analytics/dev-performance?startDate=2025-09-01&endDate=2025-10-15
Response:
[
  {
    devId: 1,
    devName: 'João',
    ticketsResolved: 45,
    avgResolutionTimeMinutes: 192,
    slaRate: 92,
    velocityPerDay: 2.3
  },
  ...
]

// Tickets mais demorados
GET /api/jira/analytics/slowest-tickets?limit=10&integration=genius
Response:
[
  {
    jiraIssueKey: 'GEN-456',
    summary: 'Integração complexa com sistema legado',
    resolutionTimeMinutes: 1200,
    assignedDev: 'Maria',
    createdAt: '2025-10-01',
    resolutionDate: '2025-10-05'
  },
  ...
]

// Tendência de velocidade (agrupado por semana)
GET /api/jira/analytics/velocity-trend?integration=service-desk&weeks=12
Response:
[
  { weekStart: '2025-08-01', avgVelocity: 1.8, totalResolved: 25 },
  { weekStart: '2025-08-08', avgVelocity: 2.1, totalResolved: 30 },
  ...
]

// Backlog histórico (tamanho do backlog ao longo do tempo)
GET /api/jira/analytics/backlog-trend?integration=genius&weeks=8
Response:
[
  { date: '2025-09-01', backlogSize: 45 },
  { date: '2025-09-08', backlogSize: 50 },
  { date: '2025-09-15', backlogSize: 42 },
  ...
]
```

---

## 🎯 ROADMAP DE IMPLEMENTAÇÃO (Simplificado)

### **Sprint 1: Alocação Semanal (3-4 dias)**
- [ ] Migration: criar tabela `DevWeekAllocation`
- [ ] Backend: CRUD de alocações
- [ ] Frontend: Componente `DevAllocationManager` (grid semanal)
- [ ] Frontend: Integrar com página "Time"
- [ ] Frontend: Adicionar card no Overview

### **Sprint 2: Setup Jira (3-4 dias)**
- [ ] Migration: criar tabelas `JiraIntegration` e `JiraIssue`
- [ ] Backend: Serviço `JiraService` com métodos básicos
- [ ] Backend: Endpoints de configuração
- [ ] Frontend: Página de configuração de integrações
- [ ] Teste manual de conexão com Jira

### **Sprint 3: Sincronização Jira (4-5 dias)**
- [ ] Backend: Job de sincronização automática (cron)
- [ ] Backend: Cálculo de métricas (tempo de resposta, resolução)
- [ ] Backend: Mapear assignee Jira → Dev do sistema
- [ ] Frontend: Página de status de sincronização
- [ ] Logs e tratamento de erros

### **Sprint 4: Analytics Básico (3-4 dias)**
- [ ] Backend: Endpoints de analytics
- [ ] Frontend: Página `SupportAnalyticsPage`
- [ ] Frontend: Cards de métricas
- [ ] Frontend: Tabela de performance por dev
- [ ] Frontend: Gráfico de volume por semana

### **Sprint 5: Analytics Avançado (4-5 dias)**
- [ ] Backend: Análise de complexidade automática
- [ ] Backend: Tendência de velocidade
- [ ] Frontend: Gráficos de tendência
- [ ] Frontend: Lista de tickets demorados
- [ ] Frontend: Export para Excel

---

## 🔧 Configuração Inicial do Jira

### **1. Obter API Token**
1. Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
2. Clique em "Create API token"
3. Copie o token gerado

### **2. Descobrir IDs dos Boards**
```bash
curl -u your-email@company.com:your-api-token \
  https://your-domain.atlassian.net/rest/agile/1.0/board

# Resposta inclui:
# { "id": 123, "name": "Service Desk Board" }
# { "id": 456, "name": "Genius Board" }
```

### **3. Testar Conexão**
```bash
curl -u your-email@company.com:your-api-token \
  "https://your-domain.atlassian.net/rest/api/3/search?jql=project=SD&maxResults=1"
```

---

## 📊 Exemplo de Análise Gerada

### **Relatório Semanal Automático**
```
📊 Relatório de Suporte - Semana 14-20 Out 2025

🟠 Service Desk:
  • 42 tickets resolvidos
  • Tempo médio: 3.2h
  • SLA: 88% (⚠️ abaixo da meta de 90%)
  • Backlog: 18 tickets abertos

🟢 Genius:
  • 28 tickets resolvidos
  • Tempo médio: 1.8h
  • SLA: 96% (✅ dentro da meta)
  • Backlog: 7 tickets abertos

👥 Top Performers:
  1. João: 18 tickets, 2.1h médio
  2. Maria: 15 tickets, 2.5h médio
  3. Pedro: 12 tickets, 3.0h médio

⚠️ Alertas:
  • Dev Carlos está 25% abaixo da velocidade média
  • 3 tickets estão abertos há mais de 5 dias
  • Backlog do Service Desk cresceu 20% esta semana

💡 Insights:
  • Tickets de "Integração Nitro" são 2x mais demorados que a média
  • 60% dos tickets do Genius são resolvidos em <1h (muito eficiente!)
  • Pico de volume: Terça-feira às 14h
```

---

## ✅ Benefícios Desta Abordagem

1. **✅ Simplicidade**: Usa Jira como fonte de verdade (já está em uso)
2. **✅ Visibilidade**: Alocação semanal clara (quem está onde)
3. **✅ Métricas**: Dados históricos para análise e melhoria contínua
4. **✅ Integração**: Sincronização automática via API
5. **✅ Decisões**: Data-driven (não achismo)
6. **✅ Reconhecimento**: Trabalho de suporte fica visível

---

## 🚀 Próximos Passos

1. Revisar e validar este plano
2. Obter credenciais de API do Jira
3. Iniciar Sprint 1 (Alocação Semanal)
4. Iterar incrementalmente (cada sprint entrega valor)
