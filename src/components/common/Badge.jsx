/**
 * Componente Badge reutilizável
 */
export const Badge = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'inline-block px-2 py-1 rounded text-xs font-medium';

  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <span className={`${baseClasses} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
