import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'new-order',
      title: 'Nuevo Pedido',
      description: 'Crear un pedido rápido',
      icon: 'Plus',
      color: 'bg-primary',
      action: () => navigate('/order-management')
    },
    {
      id: 'view-menu',
      title: 'Gestionar Menú',
      description: 'Editar platos y precios',
      icon: 'UtensilsCrossed',
      color: 'bg-accent',
      action: () => navigate('/menu-management')
    },
    {
      id: 'sales-report',
      title: 'Reportes',
      description: 'Ver análisis de ventas',
      icon: 'BarChart3',
      color: 'bg-success',
      action: () => navigate('/sales-reports')
    },
    {
      id: 'user-management',
      title: 'Usuarios',
      description: 'Gestionar personal',
      icon: 'Users',
      color: 'bg-secondary',
      action: () => navigate('/user-management')
    }
  ];

  const shortcuts = [
    {
      id: 'kitchen-display',
      title: 'Pantalla de Cocina',
      icon: 'ChefHat',
      badge: '4 pendientes'
    },
    {
      id: 'inventory',
      title: 'Inventario',
      icon: 'Package',
      badge: '2 agotados'
    },
    {
      id: 'reservations',
      title: 'Reservas',
      icon: 'Calendar',
      badge: '8 hoy'
    },
    {
      id: 'feedback',
      title: 'Comentarios',
      icon: 'MessageSquare',
      badge: '3 nuevos'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
          <p className="text-sm text-muted-foreground mt-1">Accesos directos a funciones principales</p>
        </div>
        
        <div className="p-6 space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform duration-200`}>
                <Icon name={action.icon} size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  {action.title}
                </h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </button>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Accesos Directos</h3>
          <p className="text-sm text-muted-foreground mt-1">Información rápida del estado</p>
        </div>
        
        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={shortcut.icon} size={16} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{shortcut.title}</span>
              </div>
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                {shortcut.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Estado del Sistema</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-foreground">Conexión TPV</span>
            </div>
            <span className="text-xs text-success font-medium">Activo</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-foreground">Base de Datos</span>
            </div>
            <span className="text-xs text-success font-medium">Sincronizado</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm text-foreground">Impresora Cocina</span>
            </div>
            <span className="text-xs text-warning font-medium">Advertencia</span>
          </div>
          
          <div className="pt-3 border-t border-border">
            <Button variant="outline" size="sm" fullWidth iconName="Settings" iconPosition="left">
              Configuración del Sistema
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;