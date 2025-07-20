import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [showActions, setShowActions] = useState(false);

  const bulkActions = [
    { value: 'activate', label: 'Activar Usuarios', icon: 'UserCheck', variant: 'success' },
    { value: 'deactivate', label: 'Desactivar Usuarios', icon: 'UserX', variant: 'destructive' },
    { value: 'reset-password', label: 'Restablecer Contraseñas', icon: 'KeyRound', variant: 'outline' },
    { value: 'export', label: 'Exportar Seleccionados', icon: 'Download', variant: 'outline' },
    { value: 'delete', label: 'Eliminar Usuarios', icon: 'Trash2', variant: 'destructive' }
  ];

  const handleBulkAction = (action) => {
    onBulkAction(action);
    setShowActions(false);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedCount} usuario{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Limpiar selección
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowActions(!showActions)}
              iconName="ChevronDown"
              iconPosition="right"
              iconSize={16}
            >
              Acciones en lote
            </Button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-lg shadow-pronounced z-200 min-w-56">
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                    Seleccionar acción para {selectedCount} usuario{selectedCount !== 1 ? 's' : ''}
                  </div>
                  {bulkActions.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => handleBulkAction(action.value)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center space-x-2 ${
                        action.variant === 'destructive' ?'hover:bg-destructive/10 hover:text-destructive' 
                          : action.variant === 'success' ?'hover:bg-success/10 hover:text-success' :'hover:bg-muted'
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
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;