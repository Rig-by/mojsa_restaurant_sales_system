import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CategoryModal = ({ 
  isOpen, 
  onClose, 
  category, 
  categories, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Folder',
    parentId: '',
    sortOrder: 0
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || 'Folder',
        parentId: category.parentId || '',
        sortOrder: category.sortOrder || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'Folder',
        parentId: '',
        sortOrder: 0
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const iconOptions = [
    { value: 'Folder', label: 'Carpeta' },
    { value: 'UtensilsCrossed', label: 'Platos Principales' },
    { value: 'Coffee', label: 'Bebidas' },
    { value: 'Cookie', label: 'Postres' },
    { value: 'Salad', label: 'Ensaladas' },
    { value: 'Pizza', label: 'Pizza' },
    { value: 'Sandwich', label: 'Bocadillos' },
    { value: 'IceCream', label: 'Helados' },
    { value: 'Wine', label: 'Vinos' },
    { value: 'Beef', label: 'Carnes' },
    { value: 'Fish', label: 'Pescados' },
    { value: 'Soup', label: 'Sopas' }
  ];

  const parentOptions = [
    { value: '', label: 'Sin categoría padre (Raíz)' },
    ...categories
      .filter(cat => cat.id !== category?.id) // Evitar auto-referencia
      .map(cat => ({
        value: cat.id,
        label: cat.name
      }))
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'El orden no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSave({
        ...formData,
        id: category?.id || Date.now().toString(),
        itemCount: category?.itemCount || 0,
        subcategories: category?.subcategories || []
      });
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-md animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input
              label="Nombre de la Categoría"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
              placeholder="Ej: Platos Principales"
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg resize-none h-20"
                placeholder="Descripción opcional de la categoría..."
              />
            </div>

            <Select
              label="Icono"
              options={iconOptions}
              value={formData.icon}
              onChange={(value) => handleInputChange('icon', value)}
              placeholder="Seleccionar icono"
            />

            <Select
              label="Categoría Padre"
              options={parentOptions}
              value={formData.parentId}
              onChange={(value) => handleInputChange('parentId', value)}
              placeholder="Seleccionar categoría padre"
            />

            <Input
              label="Orden de Visualización"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
              error={errors.sortOrder}
              min="0"
              description="Número menor aparece primero"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              {category ? 'Actualizar' : 'Crear'} Categoría
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;