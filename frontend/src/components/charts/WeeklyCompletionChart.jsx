import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

/**
 * Gráfico de linha mostrando a porcentagem de conclusão de tarefas por semana
 */
export const WeeklyCompletionChart = ({ data }) => {
  // Formato esperado de data:
  // [
  //   { week: 'Sem 30/09', completionRate: 89, completed: 8, total: 9 },
  //   { week: 'Sem 07/10', completionRate: 75, completed: 6, total: 8 },
  //   ...
  // ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.week}</p>
          <p className="text-sm text-blue-600">
            Taxa de conclusão: {data.completionRate}%
          </p>
          <p className="text-sm text-gray-600">
            Concluídas: {data.completed} de {data.total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Evolução de conclusão de tarefas
            </CardTitle>
            <CardDescription>
              Porcentagem de tarefas concluídas por semana
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              formatter={() => 'Taxa de Conclusão'}
            />
            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
              name="Taxa de Conclusão (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
