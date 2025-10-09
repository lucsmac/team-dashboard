# Team Report Dashboard

Dashboard moderno e interativo para acompanhamento de times de desenvolvimento, construído com React, Vite, Tailwind CSS e shadcn/ui.

## 🚀 Features

### 🎯 Nova Interface com Abas
- **Resumo**: Visão executiva com métricas principais, distribuição do time e próximas entregas
- **Time**: Visualização em cards ou tabela com filtros por nome e projeto
- **Demandas**: Organização por categoria com accordion expansível
- **Highlights**: Entraves, conquistas e informações importantes em painéis dedicados

### ✨ Funcionalidades
- ✅ **Sistema de Abas**: Navegação organizada com URL routing
- 📊 **Métricas em Tempo Real**: Cards com estatísticas calculadas automaticamente
- 🔍 **Filtros e Busca**: Encontre desenvolvedores e projetos rapidamente
- 🎨 **Dois Modos de Visualização**: Cards visuais ou tabela detalhada
- 💾 **Persistência Automática**: Dados salvos no localStorage
- ✏️ **Edição Inline**: Atualize informações diretamente na interface
- 📥 **Export/Import**: Backup e restauração via JSON
- 📱 **Responsivo**: Interface adaptável para desktop, tablet e mobile
- 🎨 **shadcn/ui**: Componentes modernos e acessíveis

## 🛠️ Tecnologias

- **React 18** - UI library
- **Vite** - Build tool e dev server
- **React Router** - Navegação e routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Componentes UI de alta qualidade
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado
- **localStorage** - Persistência de dados

## 📦 Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd team-report

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── tabs.jsx
│   │   ├── card.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   └── ...
│   ├── dashboard/              # Componentes principais das abas
│   │   ├── DashboardTabs.jsx  # Container com routing
│   │   ├── OverviewTab.jsx    # Aba de resumo
│   │   ├── TeamTab.jsx         # Aba do time
│   │   ├── DemandsTab.jsx      # Aba de demandas
│   │   └── HighlightsTab.jsx   # Aba de highlights
│   ├── overview/               # Componentes de métricas
│   │   ├── MetricsCards.jsx
│   │   ├── TeamDistribution.jsx
│   │   ├── UpcomingDeliveries.jsx
│   │   └── RecentHighlights.jsx
│   ├── team/                   # Componentes do time
│   │   ├── TeamFilters.jsx
│   │   └── TeamMemberCard.jsx
│   ├── devs/                   # Componentes legados (DevTable, DevRow)
│   ├── demands/                # Componentes de demandas
│   ├── deliveries/             # Componentes de entregas
│   ├── highlights/             # Componentes de highlights
│   ├── layout/                 # Container, Header
│   └── common/                 # Badge, StatusIndicator, PriorityLegend
├── context/                    # DashboardContext
├── hooks/                      # Custom hooks
├── utils/                      # Utilitários
├── services/                   # storage service
├── data/                       # initialData
├── lib/                        # shadcn utils
├── App.jsx
└── index.jsx
```

## 📝 Uso

### Navegação por Abas

O dashboard organiza a informação em 4 abas principais:

1. **🎯 Resumo** (`/overview`)
   - Cards com métricas principais
   - Gráfico de distribuição do time
   - Próximas entregas resumidas
   - Alertas e conquistas recentes

2. **👥 Time** (`/team`)
   - Busca por nome de desenvolvedor
   - Filtro por projeto atual
   - Toggle entre visualização em cards ou tabela
   - Edição inline (modo edição ativo)

3. **📋 Demandas** (`/demands`)
   - Accordion por categoria (4DX, Redemoinho, Stellantis, etc)
   - Cards com status, prioridade e devs alocados
   - Links para recursos externos
   - Expansão/colapso de categorias

4. **⭐ Highlights** (`/highlights`)
   - Painel de entraves (vermelho)
   - Painel de conquistas (verde)
   - Painel de informações importantes (azul)

### Modo de Edição

1. Clique no botão **"Editar"** no cabeçalho
2. Na **Aba Time** (visualização tabela): clique em qualquer célula para editar
3. Digite o novo valor e pressione **Enter** para salvar ou **Escape** para cancelar
4. As mudanças são salvas automaticamente no localStorage

### Export/Import/Reset

- **Exportar**: Baixa um JSON com os dados atuais (timestamped)
- **Importar**: Carrega dados de um arquivo JSON válido
- **Resetar**: Restaura os dados iniciais (confirmação necessária)

### Filtros na Aba Time

- **Busca**: Digite o nome do desenvolvedor
- **Projeto**: Selecione um projeto específico ou "Todos os projetos"
- **Visualização**: Alterne entre Cards (visual) e Tabela (detalhada)

### Personalização

- **Dados Iniciais**: Edite `src/data/initialData.js`
- **Cores**: Modifique `src/utils/colorUtils.js`
- **Temas**: Use dark mode com classe `.dark` (shadcn pronto)

## 🏃 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
```

## 🎨 Estrutura de Dados

### Developer (Dev)
```javascript
{
  id: number,
  name: string,
  color: string,        // Classe CSS do Tailwind
  lastWeek: string,
  thisWeek: string,
  nextWeek: string
}
```

### Demand
```javascript
{
  id: string,
  title: string,
  status: 'concluido' | 'em-andamento' | 'planejado' | 'bloqueado',
  priority: 'alta' | 'média' | 'baixa',
  assignedDevs: string[],
  value: 'Trade-offs' | 'Essencial' | 'Importante',
  details: string,
  links: string[]
}
```

## 🌟 Melhorias vs Versão Anterior

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Layout | Scroll vertical único | Sistema de abas |
| Navegação | Scroll | URL-based tabs |
| Organização | Tudo junto | Progressive disclosure |
| Resumo | Ao final | Aba dedicada (início) |
| Filtros | ❌ Não | ✅ Busca + filtro projeto |
| Visualizações | Apenas tabela | Cards + Tabela |
| Componentes UI | Tailwind puro | shadcn/ui |
| Accordion | ❌ Não | ✅ Por categoria |
| Cognitive Load | 🔴 Alto | 🟢 Baixo |
| Mobile | Scroll longo | Tabs compactas |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autor

Desenvolvido para o Time Core da Autoforce.

## 🔗 Links Úteis

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)
