import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ActivityModal = ({ isOpen, onClose, user }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('7days');

  const activityTypes = [
    { value: 'all', label: 'Todas las Actividades' },
    { value: 'login', label: 'Inicios de Sesión' },
    { value: 'order', label: 'Gestión de Pedidos' },
    { value: 'menu', label: 'Cambios en Menú' },
    { value: 'report', label: 'Acceso a Reportes' },
    { value: 'user', label: 'Gestión de Usuarios' }
  ];

  const dateRanges = [
    { value: '1day', label: 'Último Día' },
    { value: '7days', label: 'Últimos 7 Días' },
    { value: '30days', label: 'Últimos 30 Días' },
    { value: '90days', label: 'Últimos 90 Días' }
  ];

  // Mock activity data
  const mockActivities = [
    {
      id: 1,
      type: 'login',
      action: 'Inicio de sesión exitoso',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      details: 'Acceso desde navegador Chrome',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      type: 'order',
      action: 'Pedido creado #ORD-2025-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      details: 'Mesa 5 - Total: €45.50',
      ip: '192.168.1.100'
    },
    {
      id: 3,
      type: 'order',
      action: 'Pedido actualizado #ORD-2025-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      details: 'Estado cambiado a "En preparación"',
      ip: '192.168.1.100'
    },
    {
      id: 4,
      type: 'report',
      action: 'Reporte de ventas consultado',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      details: 'Reporte diario - 20/07/2025',
      ip: '192.168.1.100'
    },
    {
      id: 5,
      type: 'menu',
      action: 'Elemento de menú modificado',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      details: 'Precio actualizado: Paella Valenciana',
      ip: '192.168.1.100'
    },
    {
      id: 6,
      type: 'login',
      action: 'Cierre de sesión',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      details: 'Sesión cerrada manualmente',
      ip: '192.168.1.100'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return 'LogIn';
      case 'order': return 'ShoppingCart';
      case 'menu': return 'UtensilsCrossed';
      case 'report': return 'BarChart3';
      case 'user': return 'Users';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login': return 'text-success';
      case 'order': return 'text-primary';
      case 'menu': return 'text-accent';
      case 'report': return 'text-secondary';
      case 'user': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Hace menos de 1 minuto';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredActivities = mockActivities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    
    const daysDiff = Math.floor((new Date() - activity.timestamp) / (1000 * 60 * 60 * 24));
    switch (filterDate) {
      case '1day': return daysDiff <= 1;
      case '7days': return daysDiff <= 7;
      case '30days': return daysDiff <= 30;
      case '90days': return daysDiff <= 90;
      default: return true;
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Registro de Actividad
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.name} - {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                label="Tipo de Actividad"
                options={activityTypes}
                value={filterType}
                onChange={setFilterType}
              />
            </div>
            <div className="flex-1">
              <Select
                label="Período"
                options={dateRanges}
                value={filterDate}
                onChange={setFilterDate}
              />
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon name="Activity" size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No hay actividad registrada
              </h3>
              <p className="text-muted-foreground text-center">
                No se encontraron actividades para los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/40 transition-colors duration-150"
                  >
                    <div className={`p-2 rounded-full bg-background ${getActivityColor(activity.type)}`}>
                      <Icon name={getActivityIcon(activity.type)} size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">
                          {activity.action}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.details}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Globe" size={12} />
                          <span>IP: {activity.ip}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>
                            {activity.timestamp.toLocaleString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredActivities.length} de {mockActivities.length} actividades
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              size="sm"
            >
              Exportar
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;