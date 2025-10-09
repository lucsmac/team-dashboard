import { getValueBadgeColor } from '../../utils/colorUtils';

/**
 * Card individual de entrega de valor
 */
export const DeliveryCard = ({ delivery }) => {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">{delivery.title}</h3>
        <span className={`text-xs px-2 py-1 rounded border ${getValueBadgeColor(delivery.valueType)}`}>
          {delivery.valueType}
        </span>
      </div>
      <ul className="space-y-2">
        {delivery.items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
