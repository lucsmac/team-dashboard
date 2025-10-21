import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart as PieChartIcon, Calendar } from 'lucide-react';

/**
 * Gráfico de pizza/donut mostrando distribuição de tarefas por categoria com filtro de semana
 */
export const TasksByCategoryChart = ({ data }) => {
  // Formato esperado de data:
  // {
  //   previous: [{ name: '4DX', value: 12, color: '#3b82f6' }, ...],
  //   current: [{ name: '4DX', value: 15, color: '#3b82f6' }, ...]
  // }

  const [selectedWeek, setSelectedWeek] = useState('current');

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = payload[0].payload.total || 0;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} tarefas ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Só mostrar label se a porcentagem for >= 5%
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Selecionar dados com base na semana escolhida
  const weekData = selectedWeek === 'current' ? data.current : data.previous;

  // Calcular total para passar para o tooltip
  const total = weekData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = weekData.map(item => ({ ...item, total }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-500" />
              Distribuição por categoria
            </CardTitle>
            <CardDescription>
              Proporção de tarefas por categoria de projeto
            </CardDescription>
          </div>

          {/* Toggle de semana */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={selectedWeek === 'previous' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedWeek('previous')}
              className="text-xs h-7"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Anterior
            </Button>
            <Button
              variant={selectedWeek === 'current' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedWeek('current')}
              className="text-xs h-7"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Atual
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {dataWithTotal.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <p className="text-sm">Nenhuma tarefa encontrada para esta semana</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
