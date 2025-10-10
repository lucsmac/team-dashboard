import { DevBadge } from './DevBadge';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useState } from 'react';

/**
 * Linha da tabela de desenvolvedor com edição inline
 */
export const DevRow = ({ dev }) => {
  const { editMode, updateDev } = useDashboardData();
  const [editing, setEditing] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const startEdit = (field, value) => {
    setEditing(field);
    setTempValue(value);
  };

  const saveEdit = (field) => {
    updateDev(dev.id, { [field]: tempValue });
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setTempValue('');
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      saveEdit(field);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const renderEditableCell = (field, value) => {
    if (!editMode) {
      return <div className="text-sm text-gray-600">{value}</div>;
    }

    if (editing === field) {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => saveEdit(field)}
          onKeyDown={(e) => handleKeyDown(e, field)}
          className="w-full px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => startEdit(field, value)}
        className="text-sm text-gray-600 cursor-pointer hover:bg-blue-50 p-1 rounded"
      >
        {value}
      </div>
    );
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="p-3">
        <DevBadge dev={dev} />
      </td>
      <td className="p-3">
        {renderEditableCell('lastWeek', dev.lastWeek)}
      </td>
      <td className="p-3 bg-blue-50">
        <div className="font-medium text-gray-900">
          {renderEditableCell('thisWeek', dev.thisWeek)}
        </div>
      </td>
      <td className="p-3">
        {renderEditableCell('nextWeek', dev.nextWeek)}
      </td>
    </tr>
  );
};
