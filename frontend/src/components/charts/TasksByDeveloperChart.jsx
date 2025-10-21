import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

/**
 * Gráfico de barras horizontais comparando tarefas por desenvolvedor (semana anterior vs atual)
 */
export const TasksByDeveloperChart = ({ data }) => {
  // Formato esperado de data:
  // [
  //   { name: 'Edu', previous: 4, current: 5, color: '#ef4444' },
  //   { name: 'João', previous: 3, current: 4, color: '#3b82f6' },
  //   { name: 'Lucas', previous: 2, current: 3, color: '#22c55e' },
  //   ...
  // ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#94a3b8' }}></div>
              <p className="text-sm text-gray-600">
                Semana anterior: {data.previous || 0} {data.previous === 1 ? 'tarefa' : 'tarefas'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <p className="text-sm text-gray-600">
                Semana atual: {data.current || 0} {data.current === 1 ? 'tarefa' : 'tarefas'}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Ordenar por total de tarefas (decrescente)
  const sortedData = [...data].sort((a, b) =>
    (b.previous + b.current) - (a.previous + a.current)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-500" />
          Tarefas por desenvolvedor
        </CardTitle>
        <CardDescription>
          Comparação entre semana anterior e semana atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(300, sortedData.length * 50)}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="rect"
              formatter={(value) => {
                return value === 'previous' ? 'Semana anterior' : 'Semana atual';
              }}
            />
            <Bar
              dataKey="previous"
              fill="#94a3b8"
              radius={[0, 4, 4, 0]}
              name="previous"
            />
            <Bar
              dataKey="current"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              name="current"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
