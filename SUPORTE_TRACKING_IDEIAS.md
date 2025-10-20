# 🎯 Ideias de Tracking de Suporte - Team Report Dashboard

## Contexto

O time atua em três frentes:
- **Roadmap**: Demandas planejadas e previsíveis (4DX, Redemoinho, Stellantis, Projetos Especiais)
- **Service Desk**: Suporte diário com demandas imprevisíveis (rápidas, normais, demoradas)
- **Genius**: Suporte especializado
  - Customização de temas dos canais
  - Nitro (automação/integrações)
  - Autobot (chatbot)

**Problema**: Atualmente só rastreamos roadmap. Suporte é invisível no dashboard.

---

## 📊 PROPOSTA: Sistema Híbrido Roadmap + Suporte

### **Problema Atual**
- ✅ Roadmap: Demandas planejadas, previsíveis
- ❌ Suporte: Demandas imprevisíveis (Service Desk, Genius)
- ❌ Não há separação clara entre os dois mundos
- ❌ Métricas de suporte não são capturadas (volume, tempo de resposta, SLA)

### **Visão da Solução**
Criar um **sistema dual** que:
1. Mantém roadmap estratégico visível
2. Adiciona tracking de suporte operacional
3. Unifica métricas (carga real = roadmap + suporte)
4. Permite análise de **custo de oportunidade** (quanto tempo vai pra suporte vs features)

---

## 📋 ARQUITETURA PROPOSTA

### **1. Modelo de Dados Expandido**

#### **1.1 Nova entidade: `SupportTicket`**
```prisma
model SupportTicket {
  id              String    @id @default(uuid())
  ticketNumber    String?   @unique         // Ex: SD-2024-001, GEN-2024-045
  category        String                    // 'Service Desk' | 'Genius' | 'Nitro' | 'Autobot'
  subCategory     String?                   // 'Customização Tema' | 'Integração' | 'Chatbot'
  title           String
  description     String?
  requesterId     String?                   // Usuário/cliente que abriu
  requesterName   String?

  // Classificação de complexidade
  complexity      String                    // 'rapida' | 'normal' | 'demorada'
  priority        String                    // 'critica' | 'alta' | 'media' | 'baixa'

  // Status e tempo
  status          String                    // 'aberto' | 'em-atendimento' | 'aguardando-cliente' | 'resolvido' | 'cancelado'
  openedAt        DateTime  @default(now())
  firstResponseAt DateTime?
  resolvedAt      DateTime?
  closedAt        DateTime?

  // SLA tracking
  slaDeadline     DateTime?                 // Prazo baseado na complexidade
  slaViolated     Boolean   @default(false)

  // Relacionamentos
  assignedDevs    String[]                  // Nomes dos devs alocados
  relatedDemandId String?                   // Se virou uma demanda de roadmap

  // Métricas
  timeToFirstResponse  Int?                 // Minutos até primeira resposta
  timeToResolution     Int?                 // Minutos até resolução
  reopenCount          Int      @default(0) // Quantas vezes foi reaberto

  // Metadados
  tags            String[]                  // Ex: ['bug', 'urgente', 'cliente-vip']
  links           String[]                  // Zendesk, Jira, etc
  internalNotes   String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([category])
  @@index([status])
  @@index([complexity])
  @@index([openedAt])
  @@index([resolvedAt])
  @@index([slaDeadline])
  @@map("support_tickets")
}
```

#### **1.2 Tabela de Configuração de SLA**
```prisma
model SlaConfig {
  id                 String   @id @default(uuid())
  category           String   // 'Service Desk' | 'Genius'
  complexity         String   // 'rapida' | 'normal' | 'demorada'
  responseTimeMinutes Int     // Tempo para primeira resposta
  resolutionTimeHours Int     // Tempo total para resolver

  @@unique([category, complexity])
  @@map("sla_config")
}
```

Exemplos de SLA:
```javascript
// Service Desk
{ category: 'Service Desk', complexity: 'rapida', responseTime: 15min, resolution: 4h }
{ category: 'Service Desk', complexity: 'normal', responseTime: 30min, resolution: 24h }
{ category: 'Service Desk', complexity: 'demorada', responseTime: 1h, resolution: 72h }

// Genius (mais ágil)
{ category: 'Genius', complexity: 'rapida', responseTime: 5min, resolution: 1h }
{ category: 'Genius', complexity: 'normal', responseTime: 15min, resolution: 8h }
```

#### **1.3 Atualização do modelo `Dev`**
```prisma
model Dev {
  // ... campos existentes

  // Novo campo: tipo de atuação principal
  primaryWorkType String @default("roadmap") // 'roadmap' | 'suporte' | 'hibrido'

  // Capacidade semanal (horas)
  weeklyCapacity  Int?   @default(40)

  // Percentual alocado em suporte (calculado automaticamente)
  supportAllocationPercent Int? @default(0)
}
```

---

### **2. Nova Aba: "Suporte"**

Adicionar ao `App.jsx`:
```javascript
<Route path="/support" element={<SupportPage />} />
```

#### **Componente: `SupportPage.jsx`**

**Features principais**:

1. **Dashboard de Suporte** (topo da página)
   - Cards com métricas:
     - 📨 Tickets Abertos Hoje
     - ⏱️ Tempo Médio de Resposta
     - ✅ Taxa de Resolução (SLA)
     - 🔥 Tickets Críticos/Vencidos
   - Gráfico de barras: Volume por dia (últimos 7 dias)
   - Gráfico de pizza: Distribuição por categoria (Service Desk vs Genius vs Nitro vs Autobot)

2. **Kanban de Tickets**
   - Colunas: `Aberto` | `Em Atendimento` | `Aguardando Cliente` | `Resolvido`
   - Filtros:
     - Por categoria (Service Desk, Genius, Nitro, Autobot)
     - Por complexidade (Rápida, Normal, Demorada)
     - Por dev responsável
     - Por SLA (violado, próximo do prazo, dentro do prazo)
   - Drag & drop entre colunas (atualiza status)
   - Badge colorido: 🟢 No prazo | 🟡 Próximo do limite | 🔴 Atrasado

3. **Formulário de Criação de Ticket**
   - Campos:
     - Categoria (dropdown: Service Desk, Genius, Nitro, Autobot)
     - Subcategoria (dinâmica baseada na categoria)
     - Título
     - Descrição
     - Complexidade (botões: Rápida/Normal/Demorada)
     - Prioridade
     - Atribuir a dev(s)
     - Links externos (Zendesk, etc)
   - Auto-cálculo de SLA deadline ao selecionar categoria + complexidade

4. **Histórico e Busca**
   - Lista de tickets resolvidos (últimos 30 dias)
   - Busca por número, título, cliente
   - Export para Excel (relatório de produtividade)

---

### **3. Integração com Overview (Aba Resumo)**

#### **3.1 Novos Metrics Cards**
Adicionar ao `MetricsCards.jsx`:

```javascript
// Card 5: Tickets de Suporte Hoje
{
  title: "Tickets Hoje",
  value: supportTicketsToday,
  description: `${supportTicketsResolved} resolvidos`,
  icon: Ticket,
  trend: "+12% vs ontem"
}

// Card 6: SLA Compliance
{
  title: "SLA",
  value: `${slaComplianceRate}%`,
  description: "Taxa de cumprimento",
  icon: Clock,
  color: slaComplianceRate >= 90 ? 'green' : 'red'
}
```

#### **3.2 Novo Gráfico: Roadmap vs Suporte**
- Gráfico de barras empilhadas
- Eixo X: Devs
- Eixo Y: Horas/semana
- Barras:
  - 🔵 Roadmap (timeline tasks planejadas)
  - 🟠 Suporte (tickets atendidos)
  - 🟢 Capacidade ociosa
- **Insight**: Visualizar quanto tempo é "roubado" do roadmap pelo suporte

#### **3.3 Alertas no Overview**
Adicionar ao `RecentHighlights.jsx`:
- 🚨 "Service Desk com 5 tickets críticos sem atendimento"
- ⚠️ "Dev João está 80% alocado em suporte essa semana"
- ⏰ "3 tickets estão próximos de violar SLA"

---

### **4. Integração com Aba "Time"**

#### **4.1 Expandir `TeamMemberCard.jsx`**
Adicionar seção de **Estatísticas de Suporte** no card:

```javascript
// Nova seção no card
<div className="border-t pt-3">
  <div className="text-xs text-muted-foreground mb-2">Suporte esta semana</div>
  <div className="flex items-center gap-4">
    <div>
      <div className="text-lg font-bold">{ticketsAtendidos}</div>
      <div className="text-xs">tickets</div>
    </div>
    <div>
      <div className="text-lg font-bold">{tempoMedioResposta}min</div>
      <div className="text-xs">tempo médio</div>
    </div>
    <div>
      <Badge variant={slaRate >= 90 ? 'success' : 'destructive'}>
        {slaRate}% SLA
      </Badge>
    </div>
  </div>
</div>
```

#### **4.2 Filtro adicional**
- Adicionar toggle: "Mostrar apenas time de suporte" vs "Mostrar apenas roadmap"

---

### **5. Nova Aba: "Análise de Carga"**

Página dedicada para **planejamento de capacidade**:

#### **5.1 Visualização: Heatmap Semanal**
- Grid: Devs x Semanas
- Cores:
  - 🟢 Verde: <60% capacidade (disponível para roadmap)
  - 🟡 Amarelo: 60-80% (balanceado)
  - 🟠 Laranja: 80-100% (sobrecarregado)
  - 🔴 Vermelho: >100% (insustentável)
- Cálculo:
  ```
  Carga = (Horas em Roadmap + Horas em Suporte) / Capacidade Semanal
  ```

#### **5.2 Previsão de Suporte**
- Gráfico de linha: Volume de tickets nos últimos 30 dias
- Média móvel de 7 dias
- Previsão para próxima semana (baseada em tendência)
- **Insight**: "Baseado na média, esperamos 35 tickets na próxima semana"

#### **5.3 Custo de Oportunidade**
- Tabela:
  | Dev | Roadmap (h) | Suporte (h) | % Suporte | Custo (features não desenvolvidas) |
  - Ordenável por % Suporte (decrescente)
  - **Insight**: "Time gastou 120h em suporte essa semana, equivalente a 3 features médias"

---

### **6. Métricas e KPIs de Suporte**

#### **6.1 Endpoint de Analytics**
```javascript
GET /api/support/analytics?startDate=2025-10-01&endDate=2025-10-15

Response:
{
  totalTickets: 145,
  ticketsByCategory: {
    'Service Desk': 80,
    'Genius': 50,
    'Nitro': 10,
    'Autobot': 5
  },
  ticketsByComplexity: {
    'rapida': 90,
    'normal': 40,
    'demorada': 15
  },
  avgTimeToFirstResponse: 18, // minutos
  avgTimeToResolution: 240,   // minutos
  slaCompliance: 92.5,        // %
  slaViolations: 11,
  topAgents: [
    { devName: 'João', ticketsResolved: 25, avgResolutionTime: 180 },
    { devName: 'Maria', ticketsResolved: 22, avgResolutionTime: 200 }
  ],
  peakHours: [
    { hour: 9, count: 15 },
    { hour: 14, count: 18 }
  ],
  reopenRate: 8.5 // %
}
```

#### **6.2 Dashboard Executivo de Suporte**
Componente `SupportExecutiveSummary.jsx` com:
- 📊 Gráfico de linha: Evolução do volume (últimos 3 meses)
- 📈 Gráfico de barras: Taxa de SLA por categoria
- 🕐 Gráfico de área: Distribuição de tickets por hora do dia
- 🏆 Ranking: Top performers (mais tickets resolvidos, melhor SLA)

---

### **7. Automações Inteligentes**

#### **7.1 Auto-atribuição**
- Algoritmo que distribui tickets novos baseado em:
  - Carga atual do dev
  - Especialidade (frontend, backend, etc)
  - Performance em SLA
  - Disponibilidade (não está em férias/licença)

```javascript
// Lógica sugerida
function autoAssignTicket(ticket) {
  const availableDevs = devs.filter(d =>
    d.primaryWorkType === 'suporte' || d.primaryWorkType === 'hibrido'
  );

  const scores = availableDevs.map(dev => ({
    dev,
    score: calculateScore(dev, ticket)
  }));

  // Score baseado em: carga (40%), especialidade (30%), SLA histórico (30%)
  const bestDev = scores.sort((a, b) => b.score - a.score)[0];
  return bestDev.dev;
}
```

#### **7.2 Alertas Proativos**
Sistema que envia notificações quando:
- ⏰ Ticket está 80% próximo do SLA deadline
- 🔥 Ticket crítico sem atendimento há 15min
- 📊 Volume de tickets 50% acima da média diária
- 👤 Dev com >10 tickets abertos simultaneamente
- 🚨 Taxa de SLA abaixo de 85% no dia

#### **7.3 Conversão Ticket → Demanda**
- Botão "Promover para Roadmap"
- Quando ticket revela necessidade de feature, converte em Demanda
- Mantém histórico linkado: `relatedDemandId`

---

### **8. Integrações Externas**

#### **8.1 Importação de Tickets**
Connector com ferramentas de help desk:

```javascript
// API de integração
POST /api/support/import/zendesk
POST /api/support/import/freshdesk
POST /api/support/import/jira

// Webhook para sincronização em tempo real
POST /api/webhooks/zendesk
```

#### **8.2 Export de Relatórios**
```javascript
GET /api/support/export/xlsx?period=last-week
GET /api/support/export/csv?category=genius
GET /api/support/export/pdf?type=executive-summary
```

---

## 🎯 ROADMAP DE IMPLEMENTAÇÃO

### **Fase 1: Foundation (MVP) - 2 semanas**
1. ✅ Criar tabela `SupportTicket` e migrations
2. ✅ Criar tabela `SlaConfig` com dados iniciais
3. ✅ CRUD básico de tickets (backend)
4. ✅ Página `/support` com lista de tickets
5. ✅ Formulário de criação de ticket
6. ✅ Cálculo automático de SLA deadline

### **Fase 2: Visualizações - 1 semana**
1. ✅ Kanban de tickets
2. ✅ Dashboard com métricas básicas (cards)
3. ✅ Filtros (categoria, status, complexidade)
4. ✅ Integração com aba Overview (novos cards)

### **Fase 3: Analytics - 1 semana**
1. ✅ Endpoint `/api/support/analytics`
2. ✅ Gráficos de volume, SLA, distribuição
3. ✅ Análise de carga (roadmap vs suporte)
4. ✅ Heatmap de capacidade

### **Fase 4: Automação - 1 semana**
1. ✅ Auto-atribuição de tickets
2. ✅ Sistema de alertas (SLA próximo de vencer)
3. ✅ Conversão ticket → demanda
4. ✅ Export para Excel/CSV

### **Fase 5: Integrações (opcional) - 2 semanas**
1. ✅ Webhook Zendesk/Freshdesk
2. ✅ Notificações Slack
3. ✅ API pública para mobile/integrações

---

## 💎 BENEFÍCIOS

### **Para Gestores**
- 📊 Visibilidade completa: roadmap + operação
- 💰 Entender custo de oportunidade do suporte
- 🎯 Tomar decisões data-driven: contratar mais gente de suporte?
- 📈 Demonstrar valor com métricas (SLA, volume resolvido)

### **Para Devs**
- 🧾 Reconhecimento: trabalho de suporte fica visível
- ⏱️ Menos pressão: SLA claro, não é "apagar incêndio"
- 📋 Organização: tickets priorizados, sem perder no Slack

### **Para o Negócio**
- 🚀 Roadmap mais previsível (sabe quanto tempo vai pra suporte)
- 😊 Clientes mais felizes (SLA rastreado, menor tempo de resposta)
- 🔍 Insights: padrões de problemas → oportunidades de melhoria

---

## 🔥 DIFERENCIAIS vs Zendesk/Jira

Por que não usar Zendesk + Jira separados?
1. ✅ **Unificado**: Roadmap + Suporte na mesma ferramenta
2. ✅ **Carga real**: Vê quanto tempo cada dev gasta em cada coisa
3. ✅ **Sem context switch**: Time trabalha em uma única plataforma
4. ✅ **Customizado**: Feito sob medida para o fluxo da Autoforce
5. ✅ **Custo zero**: Não paga licenças de Zendesk (pode importar de lá)

---

## 📌 PRÓXIMOS PASSOS

- [ ] Validar proposta com stakeholders
- [ ] Priorizar features (MVP vs Nice-to-have)
- [ ] Definir cronograma de implementação
- [ ] Iniciar Fase 1 (Foundation)
