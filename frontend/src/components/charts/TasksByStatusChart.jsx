import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

/**
 * Gráfico de barras empilhadas mostrando distribuição de tarefas por status
 */
export const TasksByStatusChart = ({ data }) => {
  // Formato esperado de data:
  // [
  //   { week: 'Sem 30/09', concluida: 8, 'em-andamento': 3, 'nao-iniciada': 1 },
  //   { week: 'Sem 07/10', concluida: 6, 'em-andamento': 4, 'nao-iniciada': 2 },
  //   ...
  // ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(0)}%)
            </p>
          ))}
          <p className="text-sm text-gray-600 mt-1 pt-1 border-t">
            Total: {total} tarefas
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Distribuição de tarefas por status
        </CardTitle>
        <CardDescription>
          Tarefas organizadas por status ao longo das semanas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              formatter={(value) => {
                const labels = {
                  'concluida': 'Concluída',
                  'em-andamento': 'Em Andamento',
                  'nao-iniciada': 'Não Iniciada'
                };
                return labels[value] || value;
              }}
            />
            <Bar
              dataKey="concluida"
              stackId="a"
              fill="#22c55e"
              name="concluida"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="em-andamento"
              stackId="a"
              fill="#f59e0b"
              name="em-andamento"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="nao-iniciada"
              stackId="a"
              fill="#ef4444"
              name="nao-iniciada"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
