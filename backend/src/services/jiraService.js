/**
 * Serviço de integração com Jira REST API v3
 * Docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
 */

/**
 * Cliente Jira REST API
 */
export class JiraService {
  constructor(jiraUrl, email, apiToken) {
    this.jiraUrl = jiraUrl;
    this.auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
  }

  /**
   * Fazer requisição à API do Jira
   */
  async request(endpoint, options = {}) {
    const url = `${this.jiraUrl}/rest/api/3${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Fazer busca JQL usando novo endpoint /search/jql
   */
  async searchJql(jql, maxResults = 1, fields = ['status']) {
    // Jira API exige maxResults entre 1 e 5000
    const validMaxResults = Math.max(1, Math.min(5000, maxResults));

    // Construir URL com fields
    const fieldsParam = fields.length > 0 ? `&fields=${fields.join(',')}` : '';
    const url = `${this.jiraUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${validMaxResults}${fieldsParam}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Obter apenas a contagem de issues para uma query JQL
   * Usa endpoint /search/jql com maxResults=1 e conta manualmente via paginação
   * Como o novo endpoint não retorna 'total', precisamos estimar baseado em isLast
   */
  async getIssueCount(jql) {
    console.log(`    📥 getIssueCount chamado com JQL: ${jql}`);

    // Fazer primeira requisição para ver se há resultados
    const result = await this.searchJql(jql, 5000, ['id']);

    console.log(`    📤 Resposta da API:`);
    console.log(`       - isLast: ${result.isLast}`);
    console.log(`       - Quantidade de issues: ${result.issues ? result.issues.length : 0}`);

    // Se isLast = true, o total é o tamanho do array issues
    if (result.isLast) {
      const count = result.issues ? result.issues.length : 0;
      console.log(`    ✅ Retornando contagem: ${count}`);
      return count;
    }

    // Se não é a última página, significa que há mais de 5000
    // Para simplificar, vamos retornar o tamanho do array + estimativa
    // Ou podemos fazer outra abordagem: usar o endpoint antigo apenas para count
    const count = result.issues ? result.issues.length : 0;
    console.log(`    ⚠️  Há mais páginas! Retornando contagem parcial: ${count}`);
    return count;
  }

  /**
   * Testar conexão com Jira
   */
  async testConnection() {
    try {
      const result = await this.request('/myself');
      return {
        success: true,
        user: {
          displayName: result.displayName,
          emailAddress: result.emailAddress,
          accountId: result.accountId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Buscar issues de um projeto com filtros
   */
  async getIssues(options = {}) {
    const {
      projectKey,
      startDate,
      endDate,
      status,
      assignee,
      maxResults = 100,
      startAt = 0
    } = options;

    // Construir JQL (Jira Query Language)
    let jql = `project = ${projectKey}`;

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

    // Ordenar por data de criação
    jql += ' ORDER BY created DESC';

    // Buscar issues
    const result = await this.request(
      `/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&startAt=${startAt}`
    );

    return result;
  }

  /**
   * Buscar detalhes de uma issue específica com changelog
   */
  async getIssueDetails(issueKey) {
    const result = await this.request(`/issue/${issueKey}?expand=changelog`);
    return result;
  }

  /**
   * Buscar comentários de uma issue
   */
  async getIssueComments(issueKey) {
    const result = await this.request(`/issue/${issueKey}/comment`);
    return result.comments;
  }

  /**
   * Calcular tempo até primeira resposta (primeiro comentário)
   * Retorna tempo em minutos
   */
  async calculateTimeToFirstResponse(issueKey, createdAt) {
    try {
      const comments = await this.getIssueComments(issueKey);

      if (comments.length === 0) {
        return null;
      }

      const firstComment = comments[0];
      const firstResponseAt = new Date(firstComment.created);
      const created = new Date(createdAt);

      return Math.floor((firstResponseAt - created) / 1000 / 60); // minutos
    } catch (error) {
      console.error(`Error calculating time to first response for ${issueKey}:`, error);
      return null;
    }
  }

  /**
   * Calcular tempo em um status específico
   * Retorna tempo em minutos
   */
  calculateTimeInStatus(changelog, targetStatus) {
    let timeInStatus = 0;
    let enteredAt = null;

    if (!changelog || !changelog.histories) {
      return 0;
    }

    for (const history of changelog.histories) {
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
   * Calcular tempo total de resolução
   * Retorna tempo em minutos
   */
  calculateTimeToResolution(createdAt, resolutionDate) {
    if (!resolutionDate) {
      return null;
    }

    const created = new Date(createdAt);
    const resolved = new Date(resolutionDate);

    return Math.floor((resolved - created) / 1000 / 60); // minutos
  }

  /**
   * Obter informações de um board
   */
  async getBoardInfo(boardId) {
    try {
      const result = await this.request(`/agile/1.0/board/${boardId}`);
      return result;
    } catch (error) {
      console.error(`Error fetching board ${boardId}:`, error);
      throw error;
    }
  }

  /**
   * Obter issues de um board
   */
  async getBoardIssues(boardId, options = {}) {
    const {
      startDate,
      endDate,
      status,
      maxResults = 100
    } = options;

    let jql = `board = ${boardId}`;

    if (startDate) {
      jql += ` AND created >= '${startDate}'`;
    }
    if (endDate) {
      jql += ` AND created <= '${endDate}'`;
    }
    if (status) {
      jql += ` AND status = '${status}'`;
    }

    jql += ' ORDER BY created DESC';

    const result = await this.request(
      `/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`
    );

    return result.issues;
  }

  /**
   * Obter métricas do board (backlog, em progresso, concluídas)
   */
  async getBoardMetrics(boardId, projectKey) {
    try {
      console.log(`\n🚀 ========== INICIANDO getBoardMetrics ==========`);
      console.log(`📌 Board ID: ${boardId}`);
      console.log(`📌 Project Key: ${projectKey}`);

      // Primeiro, buscar todas as issues para ver os status e tipos disponíveis (debug)
      const jqlAll = `project = "${projectKey}"`;
      const allIssues = await this.searchJql(jqlAll, 50, ['status', 'issuetype']);

      // Log dos status e tipos encontrados (para debug)
      const statuses = new Set();
      const types = new Set();
      if (allIssues.issues) {
        allIssues.issues.forEach(issue => {
          if (issue.fields?.status?.name) {
            statuses.add(issue.fields.status.name);
          }
          if (issue.fields?.issuetype?.name) {
            types.add(issue.fields.issuetype.name);
          }
        });
        console.log(`📊 Status disponíveis no projeto ${projectKey}:`, Array.from(statuses));
        console.log(`📊 Tipos disponíveis no projeto ${projectKey}:`, Array.from(types));
      }

      // Filtro para apenas Bugs (Autódromo Clássico)
      const bugFilter = ` AND type = "Bug (Autódromo Clássico)"`;
      console.log(`🐛 Filtro de tipo: ${bugFilter}`);

      // Buscar issues em progresso (Em Resolução) - apenas Bugs
      console.log(`\n--- BUSCANDO EM RESOLUÇÃO ---`);
      const jqlInProgress = `project = "${projectKey}" AND status = "Em Resolução"${bugFilter}`;
      console.log(`🔍 Query Em Resolução: ${jqlInProgress}`);
      const inProgressCount = await this.getIssueCount(jqlInProgress);
      console.log(`✅ Resultado Em Resolução: ${inProgressCount}`);

      // Issues concluídas (Aguardando Validação e Descartado) - apenas Bugs
      // Contar issues que ESTÃO nesses status E foram atualizadas nos últimos 7 dias
      console.log(`\n--- BUSCANDO CONCLUÍDAS (últimos 7 dias) ---`);
      const jqlCompleted = `project = "${projectKey}" AND status IN ("Aguardando Validação", "Descartado") AND updated >= -7d${bugFilter}`;
      console.log(`🔍 Query Concluídas: ${jqlCompleted}`);
      console.log(`⏳ Chamando getIssueCount...`);
      const completedCount = await this.getIssueCount(jqlCompleted);
      console.log(`✅ Resultado Concluídas: ${completedCount}`);

      // Backlog (Backlog, Priorizado, Pré Priorizado) - apenas Bugs
      console.log(`\n--- BUSCANDO BACKLOG ---`);
      const jqlBacklog = `project = "${projectKey}" AND status IN ("Backlog", "Priorizado", "Pré Priorizado")${bugFilter}`;
      console.log(`🔍 Query Backlog: ${jqlBacklog}`);
      const backlogCount = await this.getIssueCount(jqlBacklog);
      console.log(`✅ Resultado Backlog: ${backlogCount}`);

      console.log(`\n📊 ========== MÉTRICAS FINAIS ==========`);
      console.log(`📦 Backlog: ${backlogCount}`);
      console.log(`⚙️  Em Resolução: ${inProgressCount}`);
      console.log(`✅ Concluídas (7 dias): ${completedCount}`);
      console.log(`========================================\n`);

      return {
        backlogSize: backlogCount,
        inProgressCount: inProgressCount,
        completedThisWeek: completedCount
      };
    } catch (error) {
      console.error(`❌ Error fetching board metrics for ${boardId}:`, error);
      throw error;
    }
  }

  /**
   * Inferir complexidade baseada em tempo de resolução
   * 'rapida': < 2h
   * 'normal': 2h-8h
   * 'demorada': > 8h
   */
  inferComplexity(timeToResolutionMinutes) {
    if (!timeToResolutionMinutes) {
      return null;
    }

    const hours = timeToResolutionMinutes / 60;

    if (hours < 2) {
      return 'rapida';
    } else if (hours <= 8) {
      return 'normal';
    } else {
      return 'demorada';
    }
  }
}
