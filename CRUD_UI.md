# Interface CRUD para API

Este documento descreve a implementação da interface de usuário para criar, editar e deletar entidades através da API REST.

## Visão Geral

A UI agora permite gerenciar todas as entidades do sistema através de formulários modais e ações de edição/exclusão nos cards existentes. Todas as mudanças são sincronizadas automaticamente com o backend PostgreSQL.

## Componentes de Formulário

### 1. **DevForm** (`src/components/devs/DevForm.jsx`)

Formulário completo para gerenciar desenvolvedores com todos os novos campos.

**Campos:**
- **Nome*** (text) - Nome do desenvolvedor
- **Função*** (select) - Frontend, Backend, Fullstack, Mobile, DevOps, QA
- **Senioridade*** (select) - Júnior, Pleno, Sênior, Especialista, Líder
- **Cor** (color picker + text) - Cor de identificação visual
- **Semana Passada** (text, opcional) - Gerado automaticamente se vazio
- **Esta Semana** (text, opcional) - Gerado automaticamente se vazio
- **Próxima Semana** (text, opcional) - Gerado automaticamente se vazio

**Comportamento:**
- Validação de campos obrigatórios
- Sincronização automática de atividades: se deixar os campos de semana vazios, o sistema gera automaticamente com base nas TimelineTasks
- Override manual: preencher manualmente sobrescreve a geração automática
- Dialog modal com shadcn/ui
- Estados de loading e erro

**Uso:**
```jsx
<DevForm
  dev={editingDev}           // null para criar, objeto para editar
  isOpen={isFormOpen}
  onClose={handleCloseForm}
  onSave={handleSave}        // async function(formData)
/>
```

### 2. **DemandForm** (`src/components/demands/DemandForm.jsx`)

Formulário para criar e editar demandas com todos os campos e relacionamentos.

**Campos:**
- **Título*** (text) - Título da demanda
- **Categoria*** (select) - 4DX, Redemoinho, Stellantis, Projetos Especiais
- **Etapa*** (select) - Planejamento, Desenvolvimento, Testes, Deploy
- **Status*** (select) - Planejado, Em Andamento, Concluído, Bloqueado
- **Prioridade*** (select) - Alta, Média, Baixa
- **Valor de Negócio** (text) - Descrição do valor
- **Detalhes** (textarea) - Descrição detalhada
- **Desenvolvedores Alocados** (multi-select visual) - Chips clicáveis
- **Links** (lista dinâmica) - Adicionar/remover URLs

**Comportamento:**
- Seleção visual de devs (chips azuis quando selecionados)
- Adicionar links pressionando Enter ou botão
- Remover links individualmente
- Validação de campos obrigatórios
- Dialog modal scrollável

**Uso:**
```jsx
<DemandForm
  demand={editingDemand}
  isOpen={isFormOpen}
  onClose={handleCloseForm}
  onSave={handleSave}
/>
```

### 3. **TimelineTaskForm** (`src/components/timeline/TimelineTaskForm.jsx`)

Formulário para criar e editar tasks da timeline, incluindo vínculo com demandas.

**Campos:**
- **Título*** (text) - Título da task
- **Tipo de Semana*** (select) - Semana Anterior, Semana Atual, Próximas Semanas
- **Data de Início*** (date) - Data de início da task
- **Etapa de Entrega*** (select) - Desenvolvimento, Testes, Homologação, Deploy
- **Progresso (%)*** (number) - 0 a 100
- **Prazo** (date, opcional) - Deadline da task
- **Demanda Vinculada** (select, opcional) - Vincular com demanda existente
- **Desenvolvedores Alocados*** (multi-select visual) - Pelo menos um obrigatório

**Comportamento:**
- Mostra informações da demanda selecionada (status, etapa)
- Badge visual com categoria da demanda
- Validação: pelo menos um desenvolvedor deve ser selecionado
- Permite criar tasks independentes (sem vínculo com demanda)
- Progress input com validação 0-100

**Uso:**
```jsx
<TimelineTaskForm
  task={editingTask}
  isOpen={isFormOpen}
  onClose={handleCloseForm}
  onSave={handleSave}
/>
```

## Cards Atualizados com Ações

### **TeamMemberCard** (`src/components/team/TeamMemberCard.jsx`)

Exibe informações do desenvolvedor com botões de edição e exclusão.

**Novos Elementos:**
- Badges de função e senioridade (com cores e ícones)
- Botão de edição (ícone de lápis)
- Botão de exclusão (ícone de lixeira, vermelho)
- Confirmação antes de deletar

**Props:**
```jsx
<TeamMemberCard
  dev={dev}
  onEdit={(dev) => handleEdit(dev)}
  onDelete={(devId) => handleDelete(devId)}
/>
```

### **DemandCard** (`src/components/demands/DemandCard.jsx`)

Exibe informações da demanda com timeline tasks vinculadas.

**Novos Elementos:**
- Badge de etapa (Planejamento, Desenvolvimento, Testes, Deploy) com cores
- Seção de Timeline Tasks vinculadas (mostra até 3, com indicador "+N mais")
- Botões de edição e exclusão no header
- Progress de cada task vinculada

**Props:**
```jsx
<DemandCard
  demand={demand}
  category={category}
  onEdit={(demand) => handleEdit(demand)}
  onDelete={(demandId) => handleDelete(demandId)}
/>
```

## Páginas Atualizadas

### **TeamPage** (`src/components/dashboard/TeamPage.jsx`)

**Novas Funcionalidades:**
- Botão "Novo Dev" na toolbar
- Integração com DevForm
- Handlers para create, update, delete
- Passa callbacks para TeamMemberCard

**Fluxo de Criação:**
1. Usuário clica em "Novo Dev"
2. Abre DevForm vazio
3. Preenche campos e submete
4. `createDev()` envia para API
5. Dashboard recarrega automaticamente

**Fluxo de Edição:**
1. Usuário clica no ícone de lápis no card
2. Abre DevForm preenchido com dados existentes
3. Altera campos e submete
4. `updateDev(id, data)` envia para API
5. Dashboard recarrega automaticamente

**Fluxo de Exclusão:**
1. Usuário clica no ícone de lixeira
2. Confirmação via `window.confirm()`
3. `deleteDev(id)` envia para API
4. Dashboard recarrega automaticamente

### **DemandsPage** (`src/components/dashboard/DemandsPage.jsx`)

**Novas Funcionalidades:**
- Botão "Nova Demanda" no header
- Integração com DemandForm
- Handlers para create, update, delete
- Passa callbacks para DemandCard

**Comportamento Similar ao TeamPage:**
- Mesmo fluxo para criação, edição e exclusão
- Dialog modal para formulários
- Confirmação antes de deletar

## Sincronização Automática

### Dev Week Summaries

Os campos `lastWeek`, `thisWeek`, `nextWeek` do desenvolvedor são automaticamente preenchidos:

**Lógica:**
1. Se o campo está vazio (`null` ou `""`) → Gera automaticamente das TimelineTasks
2. Se o campo tem valor → Mantém o valor manual

**Geração Automática:**
- **Prioridade 1**: Tasks em andamento (0% < progress < 100%)
  - Formato: `"Layout Renault (90%), Banco Stellantis (60%)"`
- **Prioridade 2**: Tasks concluídas (progress = 100%)
  - Formato: `"API pagamentos - Concluído"`
- **Prioridade 3**: Tasks não iniciadas (progress = 0%)
  - Formato: `"Features 4.0, GCLD"`
- **Fallback**: `"Sem atividades"`

**Para Forçar Sincronização:**
- Edite o dev e deixe os campos de semana vazios
- Ou faça: `PUT /api/devs/:id` com `{ lastWeek: null, thisWeek: null, nextWeek: null }`

## Enums e Constantes

Todos os valores dos selects vêm de `src/utils/enums.js`:

```javascript
// Funções
DEV_ROLES = { FRONTEND, BACKEND, FULLSTACK, MOBILE, DEVOPS, QA }

// Senioridade
SENIORITY_LEVELS = { JUNIOR, PLENO, SENIOR, ESPECIALISTA, LIDER }

// Etapas de demanda
DEMAND_STAGES = { PLANEJAMENTO, DESENVOLVIMENTO, TESTES, DEPLOY }

// Etapas de entrega (timeline)
DELIVERY_STAGES = { DEV, TESTES, HOMOLOGACAO, DEPLOY }

// Status
DEMAND_STATUS = { PLANEJADO, EM_ANDAMENTO, CONCLUIDO, BLOQUEADO }

// Prioridades
PRIORITY_LEVELS = { ALTA, MEDIA, BAIXA }

// Tipos de semana
WEEK_TYPES = { PREVIOUS, CURRENT, UPCOMING }

// Categorias
DEMAND_CATEGORIES = { QUADROX, REDEMOINHO, STELLANTIS, PROJETOS_ESPECIAIS }
```

**Cores associadas:**
- `DEV_ROLE_COLORS` - Cores por função
- `SENIORITY_COLORS` - Cores por senioridade
- `STAGE_COLORS` - Cores por etapa
- `STATUS_COLORS` - Cores por status
- `PRIORITY_COLORS` - Cores por prioridade

## Estados de Loading e Erro

Todos os formulários incluem:
- **Loading state**: Desabilita botões e mostra "Salvando..."
- **Error state**: Exibe mensagem de erro em vermelho
- **Success**: Fecha o modal automaticamente após salvar

## Validação

### Client-side (HTML5 + React)
- Campos obrigatórios marcados com `required`
- Validação de formato (email, URL, número)
- Feedback visual instantâneo

### Server-side (Backend)
- Validação nos controllers
- Retorna erro 400 com mensagem descritiva
- Frontend exibe erro no topo do formulário

## Integração com DashboardContext

Todos os CRUDs usam os métodos do `DashboardContext`:

```javascript
const {
  // Devs
  createDev,
  updateDev,
  deleteDev,

  // Demands
  createDemand,
  updateDemand,
  deleteDemand,

  // Timeline Tasks
  createTimelineTask,
  updateTimelineTask,
  deleteTimelineTask,

  // Outros
  dashboardData,
  loading,
  error
} = useDashboardData();
```

**Comportamento dos métodos:**
- São funções `async` que retornam `Promise<void>`
- Em caso de sucesso: atualizam `dashboardData` automaticamente
- Em caso de erro: lançam exceção com mensagem
- Loading state gerenciado internamente

## Próximos Passos (Futuras Melhorias)

1. **Timeline Task UI**: Criar página dedicada para gerenciar timeline tasks
2. **Highlights CRUD**: Formulários para Entraves, Conquistas, Informações
3. **Deliveries CRUD**: Formulário para entregas de valor
4. **Bulk Operations**: Seleção múltipla e ações em lote
5. **Toast Notifications**: Substituir `alert()` por notificações elegantes
6. **Undo/Redo**: Sistema de histórico de mudanças
7. **Search & Filters**: Busca avançada em demands e tasks
8. **Drag & Drop**: Reorganizar tasks por arrastar
9. **Keyboard Shortcuts**: Atalhos para criar/editar (Ctrl+N, Ctrl+E)
10. **Export/Import**: Exportar dados em Excel/CSV

## Troubleshooting

### Formulário não abre
- Verificar se `isFormOpen` está sendo controlado corretamente
- Verificar se Dialog está importado de `@/components/ui/dialog`

### Dados não salvam
- Verificar se backend está rodando (`npm run dev` em `/backend`)
- Verificar se PostgreSQL está conectado
- Olhar console do navegador para erros de API
- Verificar se campos obrigatórios estão preenchidos

### Sincronização automática não funciona
- Verificar se os campos de semana estão realmente `null` (não string vazia)
- Verificar se existe TimelineTasks com `assignedDevs` contendo o nome do dev
- Verificar se `weekType` está correto (previous/current/upcoming)

### Cores não aparecem
- Verificar se enums estão importados corretamente
- Verificar se Tailwind está incluindo as classes de cores
- Adicionar classes personalizadas ao `tailwind.config.js` se necessário
