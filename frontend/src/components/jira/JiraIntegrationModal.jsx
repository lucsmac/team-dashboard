import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Wifi } from 'lucide-react';
import { api } from '@/services/api';

/**
 * Modal para criar/editar integração com Jira
 */
export function JiraIntegrationModal({ open, onClose, integration, onSuccess }) {
  const isEditing = !!integration;

  const [formData, setFormData] = useState({
    name: '',
    jiraUrl: '',
    projectKey: '',
    boardId: '',
    email: '',
    apiToken: ''
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (integration) {
      setFormData({
        name: integration.name || '',
        jiraUrl: integration.jiraUrl || '',
        projectKey: integration.projectKey || '',
        boardId: integration.boardId || '',
        email: integration.email || '',
        apiToken: '' // Não pré-preencher por segurança
      });
    } else {
      setFormData({
        name: '',
        jiraUrl: '',
        projectKey: '',
        boardId: '',
        email: '',
        apiToken: ''
      });
    }
    setTestResult(null);
    setError(null);
  }, [integration, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    // Validar campos necessários para teste
    if (!formData.jiraUrl || !formData.email || !formData.apiToken) {
      setError('Preencha Jira URL, Email e API Token para testar a conexão');
      return;
    }

    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      // Criar integração temporária ou testar existente
      if (isEditing && integration.id) {
        const result = await api.testJiraIntegration(integration.id);
        setTestResult(result);
      } else {
        // Para nova integração, precisamos criar temporariamente ou fazer teste direto
        // Por simplicidade, vamos criar e depois testar
        const tempIntegration = await api.createJiraIntegration({
          ...formData,
          name: formData.name || `temp_${Date.now()}`
        });

        const result = await api.testJiraIntegration(tempIntegration.id);
        setTestResult(result);

        // Se não der certo, deletar
        if (!result.success) {
          await api.deleteJiraIntegration(tempIntegration.id);
        } else {
          // Guardar ID para usar no save
          setFormData(prev => ({ ...prev, tempId: tempIntegration.id }));
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao testar conexão');
      setTestResult({ success: false });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validações
      if (!formData.name || !formData.jiraUrl || !formData.projectKey || !formData.boardId || !formData.email) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos');
      }

      if (!isEditing && !formData.apiToken) {
        throw new Error('API Token é obrigatório para nova integração');
      }

      const data = { ...formData };

      // Se estiver editando e apiToken estiver vazio, não enviar (mantém o existente)
      if (isEditing && !formData.apiToken) {
        delete data.apiToken;
      }

      // Se já criamos uma integração temporária durante o teste, usar update
      if (data.tempId) {
        await api.updateJiraIntegration(data.tempId, { name: data.name });
        delete data.tempId;
        onSuccess?.();
        onClose();
        return;
      }

      if (isEditing) {
        await api.updateJiraIntegration(integration.id, data);
      } else {
        await api.createJiraIntegration(data);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar integração');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Integração Jira' : 'Nova Integração Jira'}
          </DialogTitle>
          <DialogDescription>
            Configure a conexão com um board do Jira (Service Desk ou Genius)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Integração *</Label>
            <Input
              id="name"
              placeholder="Ex: Service Desk, Genius"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jiraUrl">Jira URL *</Label>
            <Input
              id="jiraUrl"
              type="url"
              placeholder="https://autoforce.atlassian.net"
              value={formData.jiraUrl}
              onChange={(e) => handleChange('jiraUrl', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectKey">Project Key *</Label>
              <Input
                id="projectKey"
                placeholder="Ex: SD, GEN"
                value={formData.projectKey}
                onChange={(e) => handleChange('projectKey', e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boardId">Board ID *</Label>
              <Input
                id="boardId"
                placeholder="Ex: 12345"
                value={formData.boardId}
                onChange={(e) => handleChange('boardId', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Jira Account) *</Label>
            <Input
              id="email"
              type="email"
              placeholder="dev@autoforce.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiToken">
              API Token {isEditing ? '(deixe em branco para manter o atual)' : '*'}
            </Label>
            <Input
              id="apiToken"
              type="password"
              placeholder={isEditing ? '(não será mostrado)' : 'Cole seu API Token aqui'}
              value={formData.apiToken}
              onChange={(e) => handleChange('apiToken', e.target.value)}
              required={!isEditing}
            />
            <p className="text-xs text-muted-foreground">
              Obtenha em: <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer" className="underline">Atlassian API Tokens</a>
            </p>
          </div>

          {/* Botão de teste */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing || loading}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando conexão...
                </>
              ) : (
                <>
                  <Wifi className="mr-2 h-4 w-4" />
                  Testar Conexão
                </>
              )}
            </Button>
          </div>

          {/* Resultado do teste */}
          {testResult && (
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {testResult.success ? (
                  <div>
                    <strong>Conexão bem-sucedida!</strong>
                    {testResult.user && (
                      <div className="mt-1 text-sm">
                        Conectado como: {testResult.user.displayName} ({testResult.user.emailAddress})
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <strong>Falha na conexão</strong>
                    <div className="mt-1 text-sm">{testResult.error || 'Verifique suas credenciais'}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Erro geral */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || testing}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                isEditing ? 'Atualizar' : 'Criar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
