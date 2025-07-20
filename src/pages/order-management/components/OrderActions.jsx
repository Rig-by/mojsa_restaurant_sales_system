import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderActions = ({ order, onStatusUpdate, onNotifyCustomer, onPrintReceipt, userRole }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Icon name="Settings" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Selecciona un pedido para ver las acciones disponibles</p>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatusActions = () => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        if (userRole === 'admin' || userRole === 'manager' || userRole === 'cashier') {
          actions.push({
            label: 'Confirmar Pedido',
            status: 'preparing',
            icon: 'CheckCircle',
            variant: 'default',
            description: 'Confirmar y enviar a cocina'
          });
        }
        break;
      case 'preparing':
        if (userRole === 'admin' || userRole === 'manager' || userRole === 'kitchen') {
          actions.push({
            label: 'Marcar como Listo',
            status: 'ready',
            icon: 'Package',
            variant: 'success',
            description: 'El pedido está listo para entrega'
          });
        }
        break;
      case 'ready':
        if (userRole === 'admin' || userRole === 'manager' || userRole === 'cashier') {
          actions.push({
            label: 'Completar Pedido',
            status: 'completed',
            icon: 'CheckCircle2',
            variant: 'success',
            description: 'Marcar como entregado/recogido'
          });
        }
        break;
    }

    return actions;
  };

  const getStatusTimeline = () => {
    const timeline = [
      { status: 'pending', label: 'Pedido Recibido', icon: 'Clock', time: order.createdAt },
      { status: 'preparing', label: 'En Preparación', icon: 'ChefHat', time: order.preparingAt },
      { status: 'ready', label: 'Listo para Entrega', icon: 'Package', time: order.readyAt },
      { status: 'completed', label: 'Completado', icon: 'CheckCircle2', time: order.completedAt }
    ];

    return timeline;
  };

  const formatTime = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIndex = (status) => {
    const statuses = ['pending', 'preparing', 'ready', 'completed'];
    return statuses.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(order.status);
  const nextActions = getNextStatusActions();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Acciones del Pedido</h3>
        <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
      </div>

      {/* Status Actions */}
      <div className="p-6 border-b border-border">
        <h4 className="font-medium text-foreground mb-4">Actualizar Estado</h4>
        <div className="space-y-3">
          {nextActions.map((action) => (
            <Button
              key={action.status}
              variant={action.variant}
              fullWidth
              onClick={() => handleStatusUpdate(action.status)}
              disabled={isUpdating}
              loading={isUpdating}
              iconName={action.icon}
              iconPosition="left"
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
            </Button>
          ))}
          
          {nextActions.length === 0 && (
            <div className="text-center py-4">
              <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {order.status === 'completed' ? 'Pedido completado' : 'No hay acciones disponibles'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-border">
        <h4 className="font-medium text-foreground mb-4">Acciones Rápidas</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            fullWidth
            onClick={() => onPrintReceipt(order.id)}
            iconName="Printer"
            iconPosition="left"
            className="justify-start"
          >
            Imprimir Recibo
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => onNotifyCustomer(order.id)}
            iconName="MessageSquare"
            iconPosition="left"
            className="justify-start"
          >
            Notificar Cliente
          </Button>
          
          {order.orderType === 'delivery' && (
            <Button
              variant="outline"
              fullWidth
              iconName="MapPin"
              iconPosition="left"
              className="justify-start"
            >
              Ver Dirección
            </Button>
          )}
        </div>
      </div>

      {/* Order Timeline */}
      <div className="flex-1 p-6">
        <h4 className="font-medium text-foreground mb-4">Cronología del Pedido</h4>
        <div className="space-y-4">
          {getStatusTimeline().map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const time = formatTime(step.time);
            
            return (
              <div key={step.status} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-success text-success-foreground' :'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={step.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </div>
                  {time && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {time}
                    </div>
                  )}
                  {isCurrent && !time && (
                    <div className="text-xs text-primary mt-1">
                      En progreso...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Info */}
      <div className="p-6 bg-muted">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Tiempo transcurrido</div>
            <div className="font-medium text-foreground">
              {Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60))} min
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Total</div>
            <div className="font-semibold text-foreground">€{order.total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderActions;