# Documentação dos Gráficos

## Visão Geral

Foram implementados 4 gráficos interativos usando **Recharts** para análise visual de dados do time.

## 📊 Gráficos Disponíveis

### 1. Gráfico de Linha - Evolução de Conclusão de Tarefas
**Componente:** `WeeklyCompletionChart`
**Localização:** `frontend/src/components/charts/WeeklyCompletionChart.jsx`

**Descrição:**
- Mostra a porcentagem de conclusão de tarefas ao longo das semanas
- Inclui dados históricos (semana anterior) e atuais
- Pode incluir projeções para semanas futuras baseadas em médias

**Dados Esperados:**
```javascript
[
  {
    week: 'Sem 30/09',
    completionRate: 89,  // Porcentagem (0-100)
    completed: 8,        // Número de tarefas concluídas
    total: 9             // Total de tarefas
  },
  ...
]
```

**Recursos:**
- Tooltip customizado mostrando detalhes (% e números absolutos)
- Linha azul com pontos destacados
- Eixo Y configurado de 0-100%
- Responsivo

---

### 2. Gráfico de Barras Empilhadas - Distribuição por Status
**Componente:** `TasksByStatusChart`
**Localização:** `frontend/src/components/charts/TasksByStatusChart.jsx`

**Descrição:**
- Visualiza a distribuição de tarefas por status ao longo das semanas
- Barras empilhadas coloridas por status
- Cores: Verde (concluída), Amarelo (em andamento), Vermelho (não iniciada)

**Dados Esperados:**
```javascript
[
  {
    week: 'Sem 07/10',
    concluida: 6,
    'em-andamento': 4,
    'nao-iniciada': 2
  },
  ...
]
```

**Recursos:**
- Tooltip mostrando porcentagem e número absoluto de cada status
- Barras empilhadas facilitam comparação visual
- Legendas traduzidas em português
- Responsivo

---

### 3. Gráfico de Pizza/Donut - Distribuição por Categoria
**Componente:** `TasksByCategoryChart`
**Localização:** `frontend/src/components/charts/TasksByCategoryChart.jsx`

**Descrição:**
- Mostra a proporção de tarefas por categoria de projeto
- Formato donut (anel) para melhor visualização
- Cores distintas para cada categoria

**Dados Esperados:**
```javascript
[
  {
    name: '4DX',
    value: 12,           // Número de tarefas
    color: '#3b82f6'     // Cor hex (opcional)
  },
  {
    name: 'Redemoinho',
    value: 8,
    color: '#8b5cf6'
  },
  ...
]
```

**Recursos:**
- Labels com porcentagem dentro do gráfico (se >= 5%)
- Tooltip com detalhes (número e porcentagem)
- Cores customizáveis por categoria
- Legendas automáticas
- Responsivo

---

### 4. Gráfico de Barras Horizontais - Tarefas por Desenvolvedor
**Componente:** `TasksByDeveloperChart`
**Localização:** `frontend/src/components/charts/TasksByDeveloperChart.jsx`

**Descrição:**
- Mostra a carga de trabalho de cada desenvolvedor
- Barras horizontais ordenadas por quantidade (decrescente)
- Cores personalizadas de acordo com a cor do desenvolvedor

**Dados Esperados:**
```javascript
[
  {
    name: 'Edu',
    tasks: 5,            // Número de tarefas
    color: '#ef4444'     // Cor hex
  },
  ...
]
```

**Recursos:**
- Ordenação automática (maior para menor)
- Cores customizadas por desenvolvedor
- Altura dinâmica baseada no número de devs
- Tooltip com detalhes
- Responsivo

---

## 🔧 Hook de Dados - `useChartData`

**Localização:** `frontend/src/hooks/useChartData.js`

Hook customizado que processa os dados do `DashboardContext` e os prepara para os gráficos.

**Retorna:**
```javascript
{
  weeklyCompletionData,     // Para WeeklyCompletionChart
  tasksByStatusData,        // Para TasksByStatusChart
  tasksByCategoryData,      // Para TasksByCategoryChart
  tasksByDeveloperData      // Para TasksByDeveloperChart
}
```

**Processamento:**
- Calcula taxa de conclusão baseada em status das tarefas
- Formata datas usando `date-fns` com locale pt-BR
- Converte cores Tailwind para hex
- Agrupa e conta tarefas por categoria e desenvolvedor
- Inclui projeções futuras quando aplicável

---

## 📍 Integração na OverviewPage

Os gráficos foram adicionados à página de Overview em uma seção dedicada:

**Localização:** `frontend/src/components/dashboard/OverviewPage.jsx`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Gráfico de Linha (Conclusão Semanal)      │
├──────────────────────┬──────────────────────┤
│  Barras Empilhadas   │  Gráfico de Pizza    │
│  (Status)            │  (Categorias)        │
├─────────────────────────────────────────────┤
│  Barras Horizontais (Desenvolvedores)      │
└─────────────────────────────────────────────┘
```

---

## 🎨 Customização

### Cores

**Status:**
- Verde (#22c55e): Concluída
- Amarelo (#f59e0b): Em Andamento
- Vermelho (#ef4444): Não Iniciada

**Categorias:**
- 4DX: Azul (#3b82f6)
- Redemoinho: Roxo (#8b5cf6)
- Stellantis: Verde (#10b981)
- Projetos Especiais: Laranja (#f59e0b)

### Responsividade

Todos os gráficos usam `ResponsiveContainer` do Recharts:
- Largura: 100% do container pai
- Altura: Configurada por gráfico (300px padrão)
- TasksByDeveloperChart: Altura dinâmica baseada no número de devs

---

## 🚀 Próximas Melhorias Sugeridas

1. **Gráfico de Burndown:**
   - Progresso planejado vs real
   - Projeção de data de conclusão

2. **Gráfico de Velocidade:**
   - Story points ou tasks completadas por sprint
   - Média móvel de 4 semanas

3. **Gráfico de Ciclo de Vida:**
   - Tempo médio em cada status
   - Identificar gargalos

4. **Heatmap de Atividades:**
   - Commits/tarefas por dia da semana
   - Horários de maior produtividade

5. **Gráfico de Dependências:**
   - Visualizar bloqueios entre tarefas
   - Caminho crítico

6. **Export de Gráficos:**
   - Exportar como PNG
   - Incluir em relatórios PDF

7. **Filtros Interativos:**
   - Selecionar período customizado
   - Filtrar por desenvolvedor/categoria
   - Comparar diferentes períodos

8. **Animações:**
   - Transições suaves ao atualizar dados
   - Animações de entrada

---

## 📦 Dependências

- **recharts** (^2.x): Biblioteca de gráficos React
- **date-fns** (^4.1.0): Formatação de datas (já instalado)

---

## 💡 Exemplos de Uso

### Uso Básico

```jsx
import { WeeklyCompletionChart } from '@/components/charts/WeeklyCompletionChart';
import { useChartData } from '@/hooks/useChartData';

function Dashboard() {
  const { weeklyCompletionData } = useChartData();

  return <WeeklyCompletionChart data={weeklyCompletionData} />;
}
```

### Dados Customizados

```jsx
const customData = [
  { week: 'Sem 01', completionRate: 75, completed: 6, total: 8 },
  { week: 'Sem 02', completionRate: 90, completed: 9, total: 10 },
];

<WeeklyCompletionChart data={customData} />
```

---

## 🐛 Troubleshooting

### Gráficos não aparecem
- Verifique se os dados estão no formato correto
- Confirme que Recharts está instalado: `npm install recharts`
- Verifique console do navegador para erros

### Cores não aparecem
- Certifique-se de passar o campo `color` nos dados
- Verifique se o hex é válido (formato `#RRGGBB`)

### Performance lenta
- Limite o número de pontos de dados (máx 20-30 para linha)
- Use `memo()` para evitar re-renderizações desnecessárias

---

## 📝 Notas de Implementação

- Todos os componentes usam shadcn/ui Card para container
- Tooltips customizados para melhor UX
- Formatação de datas em português (pt-BR)
- Acessibilidade: cores com contraste adequado
- Mobile-first: responsivos em todos os tamanhos

---

## 🔗 Referências

- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Card](https://ui.shadcn.com/docs/components/card)
- [date-fns Documentation](https://date-fns.org/)
