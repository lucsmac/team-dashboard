import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

/**
 * Gráfico de barras horizontais mostrando distribuição de tarefas por desenvolvedor
 */
export const TasksByDeveloperChart = ({ data }) => {
  // Formato esperado de data:
  // [
  //   { name: 'Edu', tasks: 5, color: '#ef4444' },
  //   { name: 'João', tasks: 4, color: '#3b82f6' },
  //   { name: 'Lucas', tasks: 3, color: '#22c55e' },
  //   ...
  // ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.tasks} {data.tasks === 1 ? 'tarefa' : 'tarefas'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Ordenar por número de tarefas (decrescente)
  const sortedData = [...data].sort((a, b) => b.tasks - a.tasks);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-500" />
          Tarefas por desenvolvedor
        </CardTitle>
        <CardDescription>
          Número de tarefas atribuídas a cada desenvolvedor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(300, sortedData.length * 40)}>
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
            <Bar
              dataKey="tasks"
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
