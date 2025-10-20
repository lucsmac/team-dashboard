import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Settings,
  Trash2,
  Edit,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { api } from '@/services/api';
import { JiraIntegrationModal } from './JiraIntegrationModal';
import { JiraMetricsCard } from './JiraMetricsCard';

/**
 * Página de configuração de integrações Jira
 */
export function JiraConfigPage() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [testingId, setTestingId] = useState(null);
  const [showMetricsId, setShowMetricsId] = useState(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getJiraIntegrations();
      setIntegrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingIntegration(null);
    setModalOpen(true);
  };

  const handleEdit = (integration) => {
    setEditingIntegration(integration);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Tem certeza que deseja deletar a integração "${name}"?`)) {
      return;
    }

    try {
      await api.deleteJiraIntegration(id);
      await loadIntegrations();
    } catch (err) {
      alert(`Erro ao deletar: ${err.message}`);
    }
  };

  const handleTest = async (id) => {
    setTestingId(id);
    try {
      const result = await api.testJiraIntegration(id);
      if (result.success) {
        alert(`Conexão bem-sucedida!\nConectado como: ${result.user?.displayName}`);
      } else {
        alert(`Falha na conexão:\n${result.error || 'Verifique suas credenciais'}`);
      }
    } catch (err) {
      alert(`Erro ao testar conexão: ${err.message}`);
    } finally {
      setTestingId(null);
    }
  };

  const toggleMetrics = (id) => {
    setShowMetricsId(prev => prev === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações Jira</h1>
          <p className="text-muted-foreground">
            Configure conexões com boards do Jira (Service Desk, Genius)
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Integração
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar integrações: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!loading && integrations.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma integração configurada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece criando uma integração com o Jira para sincronizar tickets
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Integração
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations list */}
      {integrations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {integration.name}
                        {integration.isActive ? (
                          <Badge variant="outline" className="bg-green-50">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50">
                            <XCircle className="mr-1 h-3 w-3" />
                            Inativo
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {integration.projectKey} • Board #{integration.boardId}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">URL:</span>
                      <span className="font-mono text-xs">{integration.jiraUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-xs">{integration.email}</span>
                    </div>
                    {integration.lastSyncAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última sincronização:</span>
                        <span className="text-xs">
                          {new Date(integration.lastSyncAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(integration.id)}
                      disabled={testingId === integration.id}
                    >
                      {testingId === integration.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <Wifi className="mr-2 h-4 w-4" />
                          Testar
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMetrics(integration.id)}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      {showMetricsId === integration.id ? 'Ocultar' : 'Métricas'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(integration)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(integration.id, integration.name)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics card (shown below when toggled) */}
              {showMetricsId === integration.id && (
                <JiraMetricsCard integration={integration} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Guia rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Configurar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">1. Obter API Token</h4>
            <p className="text-sm text-muted-foreground">
              Acesse{' '}
              <a
                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Atlassian API Tokens
              </a>{' '}
              e gere um novo token
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">2. Descobrir Board ID</h4>
            <p className="text-sm text-muted-foreground">
              No Jira, acesse o board desejado e copie o número da URL
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Exemplo: https://autoforce.atlassian.net/jira/software/c/projects/SD/boards/<strong>123</strong>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">3. Project Key</h4>
            <p className="text-sm text-muted-foreground">
              É o código do projeto (geralmente 2-4 letras maiúsculas). Ex: SD, GEN
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <JiraIntegrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        integration={editingIntegration}
        onSuccess={loadIntegrations}
      />
    </div>
  );
}
