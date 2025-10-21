import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { DEMAND_CATEGORY_LABELS, PRIORITY_LABELS, STATUS_COLORS } from '@/utils/enums';

/**
 * Componente para exibir demandas entregues nos últimos 7 dias
 */
export const RecentCompletedDemands = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecentCompletedDemands = async () => {
      try {
        setLoading(true);
        const data = await api.getRecentCompletedDemands(7);
        setDemands(data);
      } catch (err) {
        console.error('Erro ao carregar demandas concluídas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecentCompletedDemands();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Demandas entregues (Últimos 7 dias)
          </CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Demandas entregues (Últimos 7 dias)
          </CardTitle>
          <CardDescription className="text-red-600">
            Erro ao carregar: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Demandas entregues (Últimos 7 dias)
        </CardTitle>
        <CardDescription>
          {demands.length === 0
            ? 'Nenhuma demanda concluída nos últimos 7 dias'
            : `${demands.length} ${demands.length === 1 ? 'demanda concluída' : 'demandas concluídas'}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {demands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
            <p>Nenhuma demanda foi concluída nos últimos 7 dias.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {demands.map((demand) => (
              <div
                key={demand.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm leading-tight">{demand.title}</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex-shrink-0">
                      {DEMAND_CATEGORY_LABELS[demand.category] || demand.category}
                    </Badge>
                  </div>

                  {demand.details && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {demand.details}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(demand.completedAt)}</span>
                    </div>
                    <span className="text-green-600 font-medium">
                      {getDaysAgo(demand.completedAt)}
                    </span>
                    {demand.assignedDevs && demand.assignedDevs.length > 0 && (
                      <>
                        <ArrowRight className="h-3 w-3" />
                        <span className="flex items-center gap-1">
                          {demand.assignedDevs.slice(0, 2).join(', ')}
                          {demand.assignedDevs.length > 2 && ` +${demand.assignedDevs.length - 2}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
