import { CheckCircle } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DeliveryCard } from './DeliveryCard';

/**
 * Seção de entregas de valor
 */
export const DeliveriesSection = () => {
  const { dashboardData } = useDashboardData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        O que vamos entregar - Entrega de Valor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardData.deliveries.map((delivery) => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))}
      </div>
    </div>
  );
};
