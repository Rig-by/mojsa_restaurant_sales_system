import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MenuItemModal = ({ 
  isOpen, 
  onClose, 
  item, 
  categories, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    available: true,
    stock: 0,
    tags: [],
    allergens: [],
    branches: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        category: item.categoryId || '',
        image: item.image || '',
        available: item.available !== undefined ? item.available : true,
        stock: item.stock || 0,
        tags: item.tags || [],
        allergens: item.allergens || [],
        branches: item.branches || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        available: true,
        stock: 0,
        tags: [],
        allergens: [],
        branches: []
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  const allergenOptions = [
    { value: 'gluten', label: 'Gluten' },
    { value: 'lactose', label: 'Lactosa' },
    { value: 'nuts', label: 'Frutos Secos' },
    { value: 'eggs', label: 'Huevos' },
    { value: 'fish', label: 'Pescado' },
    { value: 'shellfish', label: 'Mariscos' },
    { value: 'soy', label: 'Soja' },
    { value: 'sesame', label: 'Sésamo' }
  ];

  const branchOptions = [
    { value: 'centro', label: 'Sucursal Centro' },
    { value: 'norte', label: 'Sucursal Norte' },
    { value: 'sur', label: 'Sucursal Sur' }
  ];

  const tagOptions = [
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'vegan', label: 'Vegano' },
    { value: 'spicy', label: 'Picante' },
    { value: 'popular', label: 'Popular' },
    { value: 'new', label: 'Nuevo' },
    { value: 'seasonal', label: 'Temporada' }
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

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
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
        id: item?.id || Date.now().toString(),
        lastUpdated: new Date().toLocaleDateString('es-ES')
      });
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {item ? 'Editar Producto' : 'Nuevo Producto'}
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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <Input
                  label="Nombre del Producto"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                  placeholder="Ej: Paella Valenciana"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg resize-none h-24 ${
                      errors.description ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="Describe el producto..."
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Precio (€)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    error={errors.price}
                    required
                    step="0.01"
                    min="0"
                  />

                  <Input
                    label="Stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    error={errors.stock}
                    min="0"
                  />
                </div>

                <Select
                  label="Categoría"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors.category}
                  required
                  placeholder="Seleccionar categoría"
                />

                <Checkbox
                  label="Producto disponible"
                  checked={formData.available}
                  onChange={(e) => handleInputChange('available', e.target.checked)}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Imagen del Producto
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    {formData.image ? (
                      <div className="relative">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleInputChange('image', '')}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Arrastra una imagen o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload').click()}
                        >
                          Seleccionar Imagen
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Select
                  label="Etiquetas"
                  options={tagOptions}
                  value={formData.tags}
                  onChange={(value) => handleInputChange('tags', value)}
                  multiple
                  searchable
                  placeholder="Seleccionar etiquetas"
                />

                <Select
                  label="Alérgenos"
                  options={allergenOptions}
                  value={formData.allergens}
                  onChange={(value) => handleInputChange('allergens', value)}
                  multiple
                  searchable
                  placeholder="Seleccionar alérgenos"
                />

                <Select
                  label="Disponible en Sucursales"
                  options={branchOptions}
                  value={formData.branches}
                  onChange={(value) => handleInputChange('branches', value)}
                  multiple
                  placeholder="Seleccionar sucursales"
                />
              </div>
            </div>
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
              {item ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;