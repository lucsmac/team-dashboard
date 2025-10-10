# Sincronização Automática Dev.thisWeek ↔ TimelineTask

## Overview

O sistema agora sincroniza automaticamente os campos `lastWeek`, `thisWeek` e `nextWeek` dos desenvolvedores com base nas `TimelineTask`s onde eles estão alocados.

## Como Funciona

### 1. **Lógica de Geração**

Quando você busca desenvolvedores via API, o backend:

1. **Busca os devs** do banco de dados
2. **Busca todas as timeline tasks**
3. **Filtra tasks por dev** (onde `assignedDevs` contém o nome do dev)
4. **Separa por semana** (previous, current, upcoming)
5. **Gera resumo textual** automaticamente

### 2. **Algoritmo de Resumo**

O resumo é gerado pela função `generateWeekSummary()`:

```javascript
// Prioridade 1: Tarefas em andamento (0% < progress < 100%)
"Layout Renault (90%), Banco Stellantis (60%)"

// Prioridade 2: Tarefas concluídas (progress = 100%)
"API pagamentos - Concluído"

// Prioridade 3: Tarefas não iniciadas (progress = 0%)
"Features 4.0, GCLD"

// Se não houver tasks
"Sem atividades"
```

### 3. **Override Manual**

O sistema **respeita edições manuais**:

```javascript
// Se dev.thisWeek já tem valor no banco:
dev.thisWeek || generateWeekSummary(tasks)
//            ↑
//            Usa o valor manual do banco

// Se dev.thisWeek estiver vazio/null:
dev.thisWeek || generateWeekSummary(tasks)
//                                    ↑
//                                    Gera automaticamente
```

**Ou seja:**
- ✅ Se você editar manualmente `dev.thisWeek` → **mantém seu texto**
- ✅ Se `dev.thisWeek` for `null` → **gera automaticamente**

## Endpoints Afetados

### **GET /api/devs**
```json
[
  {
    "id": 1,
    "name": "Edu",
    "role": "fullstack",
    "seniority": "senior",
    "lastWeek": "Migração BD - Concluído",
    "thisWeek": "Layout Renault (90%)",  // ← Gerado automaticamente
    "nextWeek": "Features 4.0",
    "_computed": {
      "lastWeekTasks": [...],
      "thisWeekTasks": [...],
      "nextWeekTasks": [...]
    }
  }
]
```

### **GET /api/devs/:id**
```json
{
  "id": 1,
  "name": "Edu",
  "thisWeek": "Layout Renault (90%)",
  "tasks": {
    "previous": [...],
    "current": [
      {
        "id": "tw1",
        "title": "Layout Renault",
        "progress": 90,
        "demand": {
          "id": "d3",
          "title": "Layout Renault",
          "category": "Redemoinho"
        }
      }
    ],
    "upcoming": [...]
  }
}
```

### **GET /api/dashboard**
```json
{
  "devs": [
    {
      "id": 1,
      "thisWeek": "Layout Renault (90%)",  // ← Sincronizado
      "_computed": { ... }
    }
  ],
  "timeline": {
    "current": [
      {
        "id": "tw1",
        "title": "Layout Renault",
        "assignedDevs": ["Edu", "Renan"]
      }
    ]
  }
}
```

## Exemplos de Sincronização

### **Cenário 1: Dev com múltiplas tasks**

**TimelineTasks:**
```javascript
[
  { title: "Layout Renault", progress: 90 },
  { title: "Banco Stellantis", progress: 60 },
  { title: "Code Review", progress: 100 }
]
```

**Resultado:**
```javascript
dev.thisWeek = "Layout Renault (90%), Banco Stellantis (60%) | Code Review - Concluído"
```

### **Cenário 2: Dev sem tasks**

**TimelineTasks:** `[]`

**Resultado:**
```javascript
dev.thisWeek = "Sem atividades"
```

### **Cenário 3: Edição manual**

**Banco de dados:**
```sql
UPDATE devs SET this_week = 'Férias' WHERE id = 1;
```

**Resultado:**
```javascript
dev.thisWeek = "Férias"  // ← Mantém o valor manual
```

### **Cenário 4: Limpar para reativar automático**

**Banco de dados:**
```sql
UPDATE devs SET this_week = NULL WHERE id = 1;
```

**Resultado:**
```javascript
dev.thisWeek = "Layout Renault (90%)"  // ← Volta a gerar automaticamente
```

## Vantagens

✅ **Atualização automática**: Não precisa editar manualmente quando tasks mudam
✅ **Override flexível**: Pode editar manualmente quando necessário
✅ **Contexto rico**: Mostra progresso das tasks
✅ **Fallback inteligente**: Sempre tem um texto para exibir
✅ **Performance**: Uma query extra, mas com índices é rápido

## Desvantagens

⚠️ **Query adicional**: Busca tasks em cada requisição de devs
⚠️ **Cache**: Não há cache (pode adicionar depois)
⚠️ **Formato fixo**: O texto gerado segue um padrão

## Otimizações Futuras

### **1. Cache com Redis**
```javascript
const cachedSummary = await redis.get(`dev:${devId}:thisWeek`);
if (cachedSummary) return cachedSummary;

const summary = generateWeekSummary(tasks);
await redis.set(`dev:${devId}:thisWeek`, summary, { EX: 3600 }); // 1h
```

### **2. Webhook após atualizar task**
```javascript
// Quando uma TimelineTask é atualizada:
await updateTimelineTask(taskId, { progress: 90 });
await invalidateDevSummaryCache(task.assignedDevs); // ← Limpa cache
```

### **3. Computed field no Prisma** (futuro)
```prisma
model Dev {
  // ...
  thisWeekComputed String? @computed // ← Quando Prisma suportar
}
```

## Testando

### **1. Ver sincronização em ação**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Testar API
curl http://localhost:5000/api/devs
```

### **2. Criar task e ver atualização**
```javascript
// Criar task
POST /api/timeline
{
  "title": "Nova Feature",
  "assignedDevs": ["Edu"],
  "weekType": "current",
  "progress": 50
}

// Buscar dev (verá a nova task no resumo)
GET /api/devs/1
// thisWeek: "Layout Renault (90%), Nova Feature (50%)"
```

### **3. Override manual**
```javascript
// Editar manualmente
PUT /api/devs/1
{
  "thisWeek": "Reuniões e planejamento"
}

// Buscar novamente
GET /api/devs/1
// thisWeek: "Reuniões e planejamento" ← Mantém manual
```

## Arquivos Envolvidos

- **`backend/src/utils/devUtils.js`** - Lógica de geração de resumos
- **`backend/src/controllers/devsController.js`** - Enriquece devs na API
- **`backend/src/controllers/dashboardController.js`** - Enriquece dashboard
- **`backend/prisma/schema.prisma`** - Schema com campos opcionais

## Migração

Os campos `lastWeek`, `thisWeek`, `nextWeek` continuam sendo `String?` (opcionais).

**Não precisa migration adicional!** O sistema funciona com o schema atual.

Se quiser forçar sincronização automática, rode:
```sql
UPDATE devs SET last_week = NULL, this_week = NULL, next_week = NULL;
```
