/**
 * Badge com cor específica do desenvolvedor
 */
export const DevBadge = ({ dev, small = false }) => {
  const sizeClasses = small ? 'px-2 py-1 text-xs' : 'px-4 py-2';

  return (
    <div className={`inline-block rounded-lg font-semibold ${dev.color} ${sizeClasses}`}>
      {dev.name}
    </div>
  );
};
