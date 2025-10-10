/**
 * Enums e constantes do sistema
 */

// Funções dos desenvolvedores
export const DEV_ROLES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  FULLSTACK: 'fullstack',
  MOBILE: 'mobile',
  DEVOPS: 'devops',
  QA: 'qa'
};

export const DEV_ROLE_LABELS = {
  [DEV_ROLES.FRONTEND]: 'Frontend',
  [DEV_ROLES.BACKEND]: 'Backend',
  [DEV_ROLES.FULLSTACK]: 'Fullstack',
  [DEV_ROLES.MOBILE]: 'Mobile',
  [DEV_ROLES.DEVOPS]: 'DevOps',
  [DEV_ROLES.QA]: 'QA'
};

// Senioridade dos desenvolvedores
export const SENIORITY_LEVELS = {
  JUNIOR: 'junior',
  PLENO: 'pleno',
  SENIOR: 'senior',
  ESPECIALISTA: 'especialista',
  LIDER: 'lider'
};

export const SENIORITY_LABELS = {
  [SENIORITY_LEVELS.JUNIOR]: 'Júnior',
  [SENIORITY_LEVELS.PLENO]: 'Pleno',
  [SENIORITY_LEVELS.SENIOR]: 'Sênior',
  [SENIORITY_LEVELS.ESPECIALISTA]: 'Especialista',
  [SENIORITY_LEVELS.LIDER]: 'Líder'
};

// Status das demandas
export const DEMAND_STATUS = {
  PLANEJADO: 'planejado',
  EM_ANDAMENTO: 'em-andamento',
  CONCLUIDO: 'concluido',
  BLOQUEADO: 'bloqueado'
};

export const DEMAND_STATUS_LABELS = {
  [DEMAND_STATUS.PLANEJADO]: 'Planejado',
  [DEMAND_STATUS.EM_ANDAMENTO]: 'Em Andamento',
  [DEMAND_STATUS.CONCLUIDO]: 'Concluído',
  [DEMAND_STATUS.BLOQUEADO]: 'Bloqueado'
};

// Prioridades
export const PRIORITY_LEVELS = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAIXA: 'baixa'
};

export const PRIORITY_LABELS = {
  [PRIORITY_LEVELS.ALTA]: 'Alta',
  [PRIORITY_LEVELS.MEDIA]: 'Média',
  [PRIORITY_LEVELS.BAIXA]: 'Baixa'
};

// Etapas das demandas
export const DEMAND_STAGES = {
  PLANEJAMENTO: 'planejamento',
  DESENVOLVIMENTO: 'desenvolvimento',
  TESTES: 'testes',
  DEPLOY: 'deploy'
};

export const DEMAND_STAGE_LABELS = {
  [DEMAND_STAGES.PLANEJAMENTO]: 'Planejamento',
  [DEMAND_STAGES.DESENVOLVIMENTO]: 'Desenvolvimento',
  [DEMAND_STAGES.TESTES]: 'Testes',
  [DEMAND_STAGES.DEPLOY]: 'Deploy'
};

// Etapas de entrega (timeline)
export const DELIVERY_STAGES = {
  DEV: 'dev',
  TESTES: 'testes',
  HOMOLOGACAO: 'homologacao',
  DEPLOY: 'deploy'
};

export const DELIVERY_STAGE_LABELS = {
  [DELIVERY_STAGES.DEV]: 'Desenvolvimento',
  [DELIVERY_STAGES.TESTES]: 'Testes',
  [DELIVERY_STAGES.HOMOLOGACAO]: 'Homologação',
  [DELIVERY_STAGES.DEPLOY]: 'Deploy'
};

// Cores por função
export const ROLE_COLORS = {
  [DEV_ROLES.FRONTEND]: 'bg-blue-200',
  [DEV_ROLES.BACKEND]: 'bg-green-200',
  [DEV_ROLES.FULLSTACK]: 'bg-purple-200',
  [DEV_ROLES.MOBILE]: 'bg-yellow-200',
  [DEV_ROLES.DEVOPS]: 'bg-orange-200',
  [DEV_ROLES.QA]: 'bg-pink-200'
};

// Cores por senioridade
export const SENIORITY_COLORS = {
  [SENIORITY_LEVELS.JUNIOR]: 'bg-gray-300',
  [SENIORITY_LEVELS.PLENO]: 'bg-blue-300',
  [SENIORITY_LEVELS.SENIOR]: 'bg-purple-300',
  [SENIORITY_LEVELS.ESPECIALISTA]: 'bg-orange-300',
  [SENIORITY_LEVELS.LIDER]: 'bg-red-300'
};

// Cores por status
export const STATUS_COLORS = {
  [DEMAND_STATUS.PLANEJADO]: 'bg-gray-200 text-gray-800',
  [DEMAND_STATUS.EM_ANDAMENTO]: 'bg-blue-200 text-blue-800',
  [DEMAND_STATUS.CONCLUIDO]: 'bg-green-200 text-green-800',
  [DEMAND_STATUS.BLOQUEADO]: 'bg-red-200 text-red-800'
};

// Cores por prioridade
export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.ALTA]: 'bg-red-500',
  [PRIORITY_LEVELS.MEDIA]: 'bg-yellow-500',
  [PRIORITY_LEVELS.BAIXA]: 'bg-green-500'
};

// Cores por etapa
export const STAGE_COLORS = {
  [DEMAND_STAGES.PLANEJAMENTO]: 'bg-purple-200 text-purple-800',
  [DEMAND_STAGES.DESENVOLVIMENTO]: 'bg-blue-200 text-blue-800',
  [DEMAND_STAGES.TESTES]: 'bg-yellow-200 text-yellow-800',
  [DEMAND_STAGES.DEPLOY]: 'bg-green-200 text-green-800'
};

export const DELIVERY_STAGE_COLORS = {
  [DELIVERY_STAGES.DEV]: 'bg-blue-200 text-blue-800',
  [DELIVERY_STAGES.TESTES]: 'bg-yellow-200 text-yellow-800',
  [DELIVERY_STAGES.HOMOLOGACAO]: 'bg-orange-200 text-orange-800',
  [DELIVERY_STAGES.DEPLOY]: 'bg-green-200 text-green-800'
};

// Alias para cores de função (usado nos cards)
export const DEV_ROLE_COLORS = ROLE_COLORS;

// Tipos de semana
export const WEEK_TYPES = {
  PREVIOUS: 'previous',
  CURRENT: 'current',
  UPCOMING: 'upcoming'
};

export const WEEK_TYPE_LABELS = {
  [WEEK_TYPES.PREVIOUS]: 'Semana Anterior',
  [WEEK_TYPES.CURRENT]: 'Semana Atual',
  [WEEK_TYPES.UPCOMING]: 'Próximas Semanas'
};

// Categorias de demandas
export const DEMAND_CATEGORIES = {
  QUADROX: '4DX',
  REDEMOINHO: 'Redemoinho',
  STELLANTIS: 'Stellantis',
  PROJETOS_ESPECIAIS: 'Projetos Especiais'
};

export const DEMAND_CATEGORY_LABELS = {
  [DEMAND_CATEGORIES.QUADROX]: '4DX',
  [DEMAND_CATEGORIES.REDEMOINHO]: 'Redemoinho',
  [DEMAND_CATEGORIES.STELLANTIS]: 'Stellantis',
  [DEMAND_CATEGORIES.PROJETOS_ESPECIAIS]: 'Projetos Especiais'
};

// Alias para status ativo (backend usa 'ativa')
export const DEMAND_STATUS_ATIVA = 'ativa';
if (!DEMAND_STATUS.ATIVA) {
  DEMAND_STATUS.ATIVA = DEMAND_STATUS_ATIVA;
  DEMAND_STATUS_LABELS[DEMAND_STATUS_ATIVA] = 'Ativa';
}
