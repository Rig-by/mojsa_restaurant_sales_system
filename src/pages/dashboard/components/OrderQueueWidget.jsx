import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderQueueWidget = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: "ORD-2025-001",
      customerName: "María García",
      items: ["Paella Valenciana", "Sangría", "Flan"],
      status: "preparing",
      priority: "high",
      orderTime: "14:30",
      estimatedTime: "15:15",
      total: "€45.50"
    },
    {
      id: "ORD-2025-002", 
      customerName: "Carlos Rodríguez",
      items: ["Jamón Ibérico", "Gazpacho", "Vino Tinto"],
      status: "ready",
      priority: "normal",
      orderTime: "14:25",
      estimatedTime: "14:55",
      total: "€38.75"
    },
    {
      id: "ORD-2025-003",
      customerName: "Ana López",
      items: ["Tortilla Española", "Café con Leche"],
      status: "pending",
      priority: "normal", 
      orderTime: "14:45",
      estimatedTime: "15:30",
      total: "€12.50"
    },
    {
      id: "ORD-2025-004",
      customerName: "Diego Martín",
      items: ["Pulpo a la Gallega", "Albariño", "Tarta de Santiago"],
      status: "preparing",
      priority: "high",
      orderTime: "14:35",
      estimatedTime: "15:20",
      total: "€52.25"
    }
  ];

  const statusFilters = [
    { key: 'all', label: 'Todos', count: orders.length },
    { key: 'pending', label: 'Pendientes', count: orders.filter(o => o.status === 'pending').length },
    { key: 'preparing', label: 'Preparando', count: orders.filter(o => o.status === 'preparing').length },
    { key: 'ready', label: 'Listos', count: orders.filter(o => o.status === 'ready').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'preparing': return 'bg-primary text-primary-foreground';
      case 'ready': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'text-error' : 'text-muted-foreground';
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Cola de Pedidos</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
            Actualizar
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedStatus(filter.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedStatus === filter.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay pedidos en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredOrders.map((order, index) => (
              <div key={order.id} className={`p-4 ${index !== filteredOrders.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors duration-200`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{order.id}</span>
                      {order.priority === 'high' && (
                        <Icon name="AlertTriangle" size={16} className={getPriorityColor(order.priority)} />
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' && 'Pendiente'}
                      {order.status === 'preparing' && 'Preparando'}
                      {order.status === 'ready' && 'Listo'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{order.total}</span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground mb-1">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.join(', ')}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>Pedido: {order.orderTime}</span>
                    <span>Estimado: {order.estimatedTime}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="xs" iconName="Eye">
                      Ver
                    </Button>
                    {order.status === 'ready' && (
                      <Button variant="success" size="xs" iconName="Check">
                        Entregar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueueWidget;