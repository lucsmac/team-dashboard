import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export const ErrorMessage = ({ error, onRetry }) => {
  const isNetworkError = error?.status === 0 || error?.message?.includes('Network');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="bg-white border-red-200">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">
            {isNetworkError ? 'Erro de Conexão' : 'Erro ao Carregar Dados'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {isNetworkError ? (
              <div className="space-y-2">
                <p>Não foi possível conectar ao servidor.</p>
                <p className="text-sm text-gray-600">
                  Verifique se o backend está rodando em{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                    http://localhost:5000
                  </code>
                </p>
              </div>
            ) : (
              <p>{error?.message || 'Ocorreu um erro inesperado.'}</p>
            )}
          </AlertDescription>

          {onRetry && (
            <div className="mt-4">
              <Button
                onClick={onRetry}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          )}

          {isNetworkError && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
              <p className="font-medium mb-1">Como iniciar o backend:</p>
              <pre className="bg-gray-800 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                cd backend{'\n'}
                npm run dev
              </pre>
            </div>
          )}
        </Alert>
      </div>
    </div>
  );
};
