export const initialData = {
  week: 'Semana 07-13 Out 2025',

  // Desenvolvedores e suas atividades
  devs: [
    {
      id: 1,
      name: 'Edu',
      color: 'bg-red-200',
      role: 'fullstack',
      seniority: 'senior'
    },
    {
      id: 2,
      name: 'Renan',
      color: 'bg-yellow-200',
      role: 'backend',
      seniority: 'pleno'
    },
    {
      id: 3,
      name: 'João',
      color: 'bg-blue-200',
      role: 'backend',
      seniority: 'senior'
    },
    {
      id: 4,
      name: 'Pedro',
      color: 'bg-gray-800 text-white',
      role: 'fullstack',
      seniority: 'pleno'
    },
    {
      id: 5,
      name: 'Lucas',
      color: 'bg-white border-2 border-gray-300',
      role: 'fullstack',
      seniority: 'especialista'
    },
    {
      id: 6,
      name: 'Gustavo',
      color: 'bg-green-200',
      role: 'fullstack',
      seniority: 'senior'
    },
    {
      id: 7,
      name: 'Alisson',
      color: 'bg-purple-200',
      role: 'qa',
      seniority: 'pleno'
    },
    {
      id: 8,
      name: 'Pagani',
      color: 'bg-orange-200',
      role: 'devops',
      seniority: 'senior'
    },
    {
      id: 9,
      name: 'Bruna',
      color: 'bg-teal-200',
      role: 'frontend',
      seniority: 'pleno'
    }
  ],

  // Demandas organizadas por categoria
  demands: {
    '4DX': [
      {
        id: 'd1',
        title: 'Churns e emergências',
        status: 'em-andamento',
        priority: 'alta',
        stage: 'desenvolvimento',
        assignedDevs: ['Gustavo', 'Alisson', 'Pagani'],
        value: 'Trade-offs',
        details: 'Redução de cancelamento + Negócio direto na MRR + Melhoria na renovação',
        links: ['https://jira.example.com/CHURN-123', 'https://docs.example.com/churn-analysis']
      },
      {
        id: 'd2',
        title: 'Features 4.0',
        status: 'planejado',
        priority: 'media',
        stage: 'planejamento',
        assignedDevs: [],
        value: 'Trade-offs',
        details: 'Geração de valor direto e prioridade para o cliente + Diferenciação de produtos',
        links: ['https://jira.example.com/FEAT-401']
      }
    ],
    'Redemoinho': [
      {
        id: 'd3',
        title: 'Layout Renault',
        status: 'em-andamento',
        priority: 'alta',
        stage: 'testes',
        assignedDevs: ['Edu', 'Renan', 'Bruna'],
        value: 'Essencial',
        details: 'Adaptação de layout homologado com requisitos do Módulo 2 + Funcionalidades adicionais',
        links: ['https://figma.com/renault-layout', 'https://jira.example.com/REN-567']
      }
    ],
    'Stellantis': [
      {
        id: 'd4',
        title: 'Banco Stellantis',
        status: 'em-andamento',
        priority: 'alta',
        stage: 'desenvolvimento',
        assignedDevs: ['João', 'Pedro'],
        value: 'Essencial',
        details: 'Revisão técnica do painel dealer Renault em relação ao fechamento novo contrato',
        links: ['https://jira.example.com/STEL-234']
      },
      {
        id: 'd5',
        title: 'GCLD',
        status: 'planejado',
        priority: 'alta',
        stage: 'planejamento',
        assignedDevs: [],
        value: 'Essencial',
        details: 'Integração com sistema GCLD para gestão de leads',
        links: ['https://confluence.example.com/gcld']
      }
    ],
    'Projetos Especiais': [
      {
        id: 'd6',
        title: 'Service Desk + Projetos especiais',
        status: 'em-andamento',
        priority: 'media',
        stage: 'desenvolvimento',
        assignedDevs: ['Lucas'],
        value: 'Essencial',
        details: 'Criar ferramenta interna para rastreamento de incidentes de Tracking e monitorar disponibilidade',
        links: ['https://jira.example.com/SD-890']
      },
      {
        id: 'd7',
        title: 'Genius e Nitro (prioridades)',
        status: 'planejado',
        priority: 'media',
        stage: 'planejamento',
        assignedDevs: [],
        value: 'Essencial',
        details: 'Adaptação de interface e funcionalidades específicas',
        links: []
      }
    ]
  },

  // Entregas da semana com valores
  deliveries: [
    {
      id: 'del1',
      title: 'Churns e emergências',
      valueType: 'Trade-offs',
      items: [
        'Redução de cancelamento',
        'Negócio direto na MRR',
        'Melhoria na renovação',
        'Desejo de rotalting',
        'Cultura crentes',
        'Ambiente de produto'
      ]
    },
    {
      id: 'del2',
      title: 'Layout Renault',
      valueType: 'Essencial',
      items: [
        'Adaptação de layout homologado',
        'Requisitos do Módulo 2',
        'Funcionalidades adicionais',
        'Ajustes de layout de vários módulos'
      ]
    },
    {
      id: 'del3',
      title: 'Features 4.0',
      valueType: 'Trade-offs',
      items: [
        'Geração de valor direto',
        'Diferenciação de produtos',
        'Oportunidades de upsell',
        'Automação de processos'
      ]
    }
  ],

  // Highlights, entraves e informações importantes
  highlights: {
    blockers: [
      {
        id: 'b1',
        text: 'Aguardando aprovação de infraestrutura para migração do BD',
        severity: 'alta'
      },
      {
        id: 'b2',
        text: 'Dependência externa da API Stellantis com atraso de 3 dias',
        severity: 'média'
      }
    ],
    important: [
      {
        id: 'i1',
        text: 'Sprint review agendada para sexta-feira às 14h',
        type: 'info'
      },
      {
        id: 'i2',
        text: 'Lucas estará de férias na próxima semana',
        type: 'warning'
      },
      {
        id: 'i3',
        text: 'Demo com cliente Renault marcada para quinta-feira',
        type: 'success'
      }
    ],
    achievements: [
      {
        id: 'a1',
        text: 'Redução de 40% no tempo de resposta da API de pagamentos'
      },
      {
        id: 'a2',
        text: 'Deploy automatizado funcionando perfeitamente'
      },
      {
        id: 'a3',
        text: 'Churn reduzido em 15% após implementação das melhorias'
      }
    ]
  },

  // Prioridades ordenadas
  priorities: [
    { level: 'alta', label: 'Alta', color: 'bg-red-500' },
    { level: 'média', label: 'Média', color: 'bg-yellow-500' },
    { level: 'baixa', label: 'Baixa', color: 'bg-green-500' }
  ],

  // Timeline semanal
  timeline: {
    currentWeek: {
      startDate: '2025-10-07',
      endDate: '2025-10-13',
      tasks: [
        {
          id: 'tw1',
          title: 'Layout Renault',
          priority: 'alta',
          status: 'em-andamento',
          progress: 90,
          assignedDevs: ['Edu', 'Renan', 'Bruna'],
          deadline: '2025-10-11T15:00:00',
          deliveryStage: 'testes',
          category: 'Redemoinho',
          demandId: 'd3', // Vinculado à demand "Layout Renault"
          highlights: ['Demo com cliente na sexta-feira', 'Módulo 2 quase completo'],
          blockers: []
        },
        {
          id: 'tw2',
          title: 'Banco Stellantis',
          priority: 'alta',
          status: 'em-andamento',
          progress: 60,
          assignedDevs: ['João', 'Pedro'],
          deadline: '2025-10-10T17:00:00',
          deliveryStage: 'dev',
          category: 'Stellantis',
          demandId: 'd4', // Vinculado à demand "Banco Stellantis"
          highlights: ['Revisão técnica em andamento'],
          blockers: ['Dependência da API Stellantis com atraso']
        },
        {
          id: 'tw3',
          title: 'Churns e emergências',
          priority: 'alta',
          status: 'em-andamento',
          progress: 40,
          assignedDevs: ['Gustavo', 'Alisson', 'Pagani'],
          deadline: null,
          deliveryStage: 'dev',
          category: '4DX',
          demandId: 'd1', // Vinculado à demand "Churns e emergências"
          highlights: ['Redução de 15% alcançada'],
          blockers: []
        },
        {
          id: 'tw4',
          title: 'Service Desk + Projetos especiais',
          priority: 'media',
          status: 'em-andamento',
          progress: 35,
          assignedDevs: ['Lucas'],
          deadline: '2025-10-12T18:00:00',
          deliveryStage: 'dev',
          category: 'Projetos Especiais',
          demandId: 'd6', // Vinculado à demand "Service Desk"
          highlights: ['Ferramenta de tracking em desenvolvimento'],
          blockers: []
        }
      ],
      alerts: [
        { text: 'Aguardando aprovação de infraestrutura para migração do BD', severity: 'alta' },
        { text: 'Dependência externa da API Stellantis com atraso de 3 dias', severity: 'média' }
      ],
      notes: ''
    },

    previousWeek: {
      startDate: '2025-09-30',
      endDate: '2025-10-06',
      completionRate: 0.89,
      completed: 8,
      total: 9,
      highlights: [
        { text: 'API de pagamentos migrada com sucesso', type: 'achievement' },
        { text: 'Deploy automatizado funcionando perfeitamente', type: 'achievement' },
        { text: 'Redução de 40% no tempo de resposta da API', type: 'achievement' }
      ],
      notes: 'Bloqueio de infraestrutura foi resolvido no meio da semana, permitindo avanço nas migrações.'
    },

    upcomingWeeks: [
      {
        startDate: '2025-10-14',
        endDate: '2025-10-20',
        plannedTasks: [
          { title: 'Features 4.0', category: '4DX', priority: 'alta', assignedDevs: ['Edu', 'Gustavo'] },
          { title: 'GCLD Integration', category: 'Stellantis', priority: 'alta', assignedDevs: ['João', 'Pedro'] },
          { title: 'Genius e Nitro', category: 'Projetos Especiais', priority: 'média', assignedDevs: ['Lucas'] },
          { title: 'Refatoração Service Desk', category: 'Projetos Especiais', priority: 'média', assignedDevs: ['Renan'] },
          { title: 'Documentação APIs', category: 'Geral', priority: 'baixa', assignedDevs: ['Bruna'] },
          { title: 'Testes automatizados', category: 'Quality', priority: 'média', assignedDevs: ['Alisson'] },
          { title: 'Monitoramento de performance', category: 'DevOps', priority: 'baixa', assignedDevs: ['Pagani'] }
        ],
        notes: 'Foco em features de diferenciação de produto e integrações estratégicas.'
      }
    ]
  }
};
