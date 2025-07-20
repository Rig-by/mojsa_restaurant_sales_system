import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const OrderQueue = ({ orders, selectedOrderId, onOrderSelect, onStatusUpdate, searchTerm, statusFilter }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'preparing':
        return 'bg-primary text-primary-foreground';
      case 'ready':
        return 'bg-success text-success-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'preparing':
        return 'ChefHat';
      case 'ready':
        return 'CheckCircle';
      case 'completed':
        return 'Package';
      default:
        return 'Circle';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeElapsed = (date) => {
    const now = new Date();
    const orderTime = new Date(date);
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Cola de Pedidos</h2>
        <div className="text-sm text-muted-foreground">
          {filteredOrders.length} de {orders.length} pedidos
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay pedidos que coincidan con los filtros</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onOrderSelect(order.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-moderate ${
                selectedOrderId === order.id
                  ? 'border-primary bg-primary/5 shadow-moderate'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-foreground">#{order.orderNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      <Icon name={getStatusIcon(order.status)} size={12} className="inline mr-1" />
                      {order.status === 'pending' && 'Pendiente'}
                      {order.status === 'preparing' && 'Preparando'}
                      {order.status === 'ready' && 'Listo'}
                      {order.status === 'completed' && 'Completado'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">€{order.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{getTimeElapsed(order.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  <span>{formatTime(order.createdAt)}</span>
                  {order.orderType === 'delivery' && (
                    <>
                      <Icon name="Truck" size={12} />
                      <span>Entrega</span>
                    </>
                  )}
                  {order.orderType === 'pickup' && (
                    <>
                      <Icon name="Package" size={12} />
                      <span>Recogida</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.items.length} artículo{order.items.length !== 1 ? 's' : ''}
                </div>
              </div>

              {order.priority === 'high' && (
                <div className="mt-2 flex items-center space-x-1 text-xs text-error">
                  <Icon name="AlertTriangle" size={12} />
                  <span>Prioridad Alta</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderQueue;