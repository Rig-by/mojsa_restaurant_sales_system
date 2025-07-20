import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MenuToolbar = ({ 
  searchQuery, 
  onSearchChange, 
  selectedBranch, 
  onBranchChange, 
  onAddNewItem, 
  onBulkAction,
  selectedItems,
  totalItems 
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const branches = [
    { value: 'all', label: 'Todas las Sucursales' },
    { value: 'centro', label: 'Sucursal Centro' },
    { value: 'norte', label: 'Sucursal Norte' },
    { value: 'sur', label: 'Sucursal Sur' }
  ];

  const bulkActions = [
    { value: 'enable', label: 'Activar Disponibilidad', icon: 'Eye' },
    { value: 'disable', label: 'Desactivar Disponibilidad', icon: 'EyeOff' },
    { value: 'duplicate', label: 'Duplicar Elementos', icon: 'Copy' },
    { value: 'export', label: 'Exportar Selección', icon: 'Download' },
    { value: 'delete', label: 'Eliminar Selección', icon: 'Trash2' }
  ];

  const handleBulkAction = (action) => {
    onBulkAction(action, selectedItems);
    setShowBulkActions(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left Section - Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar productos por nombre, descripción..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>

          {/* Branch Filter */}
          <div className="w-full sm:w-48">
            <Select
              options={branches}
              value={selectedBranch}
              onChange={onBranchChange}
              placeholder="Seleccionar sucursal"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowBulkActions(!showBulkActions)}
                iconName="MoreHorizontal"
                iconPosition="left"
                iconSize={16}
              >
                Acciones ({selectedItems.length})
              </Button>

              {showBulkActions && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-pronounced z-200 animate-slide-in">
                  <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                      Acciones en Lote
                    </div>
                    {bulkActions.map((action) => (
                      <button
                        key={action.value}
                        onClick={() => handleBulkAction(action.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center space-x-2 ${
                          action.value === 'delete'
                            ? 'hover:bg-destructive hover:text-destructive-foreground' :'hover:bg-muted'
                        }`}
                      >
                        <Icon name={action.icon} size={16} />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add New Item Button */}
          <Button
            variant="default"
            onClick={onAddNewItem}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={16} />
            <span>Total: {totalItems} productos</span>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={16} />
              <span>Seleccionados: {selectedItems.length}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span>Agotado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Stock Bajo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuToolbar;