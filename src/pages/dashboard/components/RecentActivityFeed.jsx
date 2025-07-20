import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityFeed = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'order',
      title: 'Nuevo pedido recibido',
      description: 'Pedido #ORD-2025-005 por €32.50',
      user: 'María García',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: 'ShoppingCart',
      color: 'bg-primary'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pago procesado',
      description: 'Pago de €45.75 - Tarjeta de crédito',
      user: 'Carlos Rodríguez',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      icon: 'CreditCard',
      color: 'bg-success'
    },
    {
      id: 3,
      type: 'menu',
      title: 'Plato actualizado',
      description: 'Precio de "Paella Valenciana" modificado',
      user: 'Admin',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      icon: 'UtensilsCrossed',
      color: 'bg-accent'
    },
    {
      id: 4,
      type: 'user',
      title: 'Usuario conectado',
      description: 'Ana López inició sesión',
      user: 'Sistema',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      icon: 'LogIn',
      color: 'bg-secondary'
    },
    {
      id: 5,
      type: 'inventory',
      title: 'Stock bajo',
      description: 'Jamón Ibérico - Solo quedan 3 unidades',
      user: 'Sistema',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      icon: 'AlertTriangle',
      color: 'bg-warning'
    },
    {
      id: 6,
      type: 'order',
      title: 'Pedido completado',
      description: 'Pedido #ORD-2025-003 entregado',
      user: 'Diego Martín',
      timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
      icon: 'CheckCircle',
      color: 'bg-success'
    },
    {
      id: 7,
      type: 'report',
      title: 'Reporte generado',
      description: 'Reporte de ventas diario exportado',
      user: 'Admin',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'FileText',
      color: 'bg-muted'
    },
    {
      id: 8,
      type: 'order',
      title: 'Pedido cancelado',
      description: 'Pedido #ORD-2025-001 cancelado por cliente',
      user: 'Laura Sánchez',
      timestamp: new Date(Date.now() - 4200000), // 1 hour 10 minutes ago
      icon: 'XCircle',
      color: 'bg-error'
    }
  ];

  const filters = [
    { key: 'all', label: 'Todas', count: activities.length },
    { key: 'order', label: 'Pedidos', count: activities.filter(a => a.type === 'order').length },
    { key: 'payment', label: 'Pagos', count: activities.filter(a => a.type === 'payment').length },
    { key: 'menu', label: 'Menú', count: activities.filter(a => a.type === 'menu').length },
    { key: 'user', label: 'Usuarios', count: activities.filter(a => a.type === 'user').length }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
            Actualizar
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                filter === filterOption.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay actividad reciente en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className={`p-4 ${index !== filteredActivities.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors duration-200`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <Icon name={activity.icon} size={16} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" fullWidth iconName="Eye" iconPosition="left">
          Ver Toda la Actividad
        </Button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;