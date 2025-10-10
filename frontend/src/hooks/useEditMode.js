import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar estado de edição inline de componentes
 */
export const useEditMode = (initialValue = '') => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);

  const startEdit = useCallback(() => {
    setTempValue(value);
    setIsEditing(true);
  }, [value]);

  const cancelEdit = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value]);

  const saveEdit = useCallback((onSave) => {
    setValue(tempValue);
    setIsEditing(false);
    if (onSave) {
      onSave(tempValue);
    }
  }, [tempValue]);

  const handleChange = useCallback((newValue) => {
    setTempValue(newValue);
  }, []);

  const reset = useCallback((newValue) => {
    setValue(newValue);
    setTempValue(newValue);
    setIsEditing(false);
  }, []);

  return {
    isEditing,
    value,
    tempValue,
    startEdit,
    cancelEdit,
    saveEdit,
    handleChange,
    reset
  };
};
