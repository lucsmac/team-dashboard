/**
 * Controller para gerenciar integrações com Jira
 */
import { prisma } from '../server.js';
import { JiraService } from '../services/jiraService.js';

/**
 * Listar todas as integrações
 * GET /api/jira/integrations
 */
export const getAllIntegrations = async (req, res) => {
  try {
    const integrations = await prisma.jiraIntegration.findMany({
      orderBy: { name: 'asc' }
    });

    // Ocultar apiToken na resposta (segurança)
    const safeIntegrations = integrations.map(integration => ({
      ...integration,
      apiToken: '***'
    }));

    res.json(safeIntegrations);
  } catch (error) {
    console.error('Error fetching Jira integrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
};

/**
 * Obter integração específica por ID
 * GET /api/jira/integrations/:id
 */
export const getIntegrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await prisma.jiraIntegration.findUnique({
      where: { id }
    });

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Ocultar apiToken
    res.json({
      ...integration,
      apiToken: '***'
    });
  } catch (error) {
    console.error('Error fetching Jira integration:', error);
    res.status(500).json({ error: 'Failed to fetch integration' });
  }
};

/**
 * Criar nova integração
 * POST /api/jira/integrations
 * Body: {
 *   name: 'Service Desk',
 *   jiraUrl: 'https://autoforce.atlassian.net',
 *   projectKey: 'SD',
 *   boardId: '12345',
 *   apiToken: 'your-api-token',
 *   email: 'dev@autoforce.com'
 * }
 */
export const createIntegration = async (req, res) => {
  try {
    const {
      name,
      jiraUrl,
      projectKey,
      boardId,
      apiToken,
      email
    } = req.body;

    // Validações
    if (!name || !jiraUrl || !projectKey || !boardId || !apiToken || !email) {
      return res.status(400).json({
        error: 'All fields are required: name, jiraUrl, projectKey, boardId, apiToken, email'
      });
    }

    // Verificar se já existe integração com esse nome
    const existing = await prisma.jiraIntegration.findUnique({
      where: { name }
    });

    if (existing) {
      return res.status(400).json({ error: 'Integration with this name already exists' });
    }

    // Criar integração
    const integration = await prisma.jiraIntegration.create({
      data: {
        name,
        jiraUrl,
        projectKey,
        boardId,
        apiToken,
        email
      }
    });

    res.status(201).json({
      ...integration,
      apiToken: '***'
    });
  } catch (error) {
    console.error('Error creating Jira integration:', error);
    res.status(500).json({ error: 'Failed to create integration' });
  }
};

/**
 * Atualizar integração
 * PUT /api/jira/integrations/:id
 */
export const updateIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      jiraUrl,
      projectKey,
      boardId,
      apiToken,
      email,
      isActive
    } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (jiraUrl !== undefined) data.jiraUrl = jiraUrl;
    if (projectKey !== undefined) data.projectKey = projectKey;
    if (boardId !== undefined) data.boardId = boardId;
    if (apiToken !== undefined && apiToken !== '***') data.apiToken = apiToken;
    if (email !== undefined) data.email = email;
    if (isActive !== undefined) data.isActive = isActive;

    const integration = await prisma.jiraIntegration.update({
      where: { id },
      data
    });

    res.json({
      ...integration,
      apiToken: '***'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Integration not found' });
    }
    console.error('Error updating Jira integration:', error);
    res.status(500).json({ error: 'Failed to update integration' });
  }
};

/**
 * Deletar integração
 * DELETE /api/jira/integrations/:id
 */
export const deleteIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.jiraIntegration.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Integration not found' });
    }
    console.error('Error deleting Jira integration:', error);
    res.status(500).json({ error: 'Failed to delete integration' });
  }
};

/**
 * Testar conexão com Jira
 * GET /api/jira/integrations/:id/test
 */
export const testIntegrationConnection = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await prisma.jiraIntegration.findUnique({
      where: { id }
    });

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const jiraService = new JiraService(
      integration.jiraUrl,
      integration.email,
      integration.apiToken
    );

    const testResult = await jiraService.testConnection();

    if (testResult.success) {
      res.json({
        success: true,
        message: 'Connection successful',
        user: testResult.user
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Connection failed',
        error: testResult.error
      });
    }
  } catch (error) {
    console.error('Error testing Jira connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test connection'
    });
  }
};

/**
 * Obter métricas de um board
 * GET /api/jira/integrations/:id/metrics
 */
export const getIntegrationMetrics = async (req, res) => {
  try {
    const { id } = req.params;

    const integration = await prisma.jiraIntegration.findUnique({
      where: { id }
    });

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const jiraService = new JiraService(
      integration.jiraUrl,
      integration.email,
      integration.apiToken
    );

    const metrics = await jiraService.getBoardMetrics(
      integration.boardId,
      integration.projectKey
    );

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching board metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};
