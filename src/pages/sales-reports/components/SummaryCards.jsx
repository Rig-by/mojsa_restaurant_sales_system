import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCards = ({ summaryData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return 'TrendingUp';
    if (value < 0) return 'TrendingDown';
    return 'Minus';
  };

  const cards = [
    {
      id: 'revenue',
      title: 'Ingresos Totales',
      value: formatCurrency(summaryData.totalRevenue),
      change: summaryData.revenueChange,
      icon: 'Euro',
      description: 'Ventas del período seleccionado',
      color: 'bg-primary/10 text-primary'
    },
    {
      id: 'orders',
      title: 'Pedidos Completados',
      value: summaryData.totalOrders.toLocaleString('es-ES'),
      change: summaryData.ordersChange,
      icon: 'ShoppingCart',
      description: 'Órdenes procesadas exitosamente',
      color: 'bg-success/10 text-success'
    },
    {
      id: 'customers',
      title: 'Clientes Únicos',
      value: summaryData.uniqueCustomers.toLocaleString('es-ES'),
      change: summaryData.customersChange,
      icon: 'Users',
      description: 'Base de clientes activa',
      color: 'bg-accent/10 text-accent'
    },
    {
      id: 'average',
      title: 'Ticket Promedio',
      value: formatCurrency(summaryData.averageTicket),
      change: summaryData.ticketChange,
      icon: 'Receipt',
      description: 'Valor medio por pedido',
      color: 'bg-secondary/10 text-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-card border border-border rounded-lg shadow-subtle p-6 hover:shadow-moderate transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
              <Icon name={card.icon} size={24} />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(card.change)}`}>
              <Icon name={getChangeIcon(card.change)} size={16} />
              <span className="text-sm font-medium">
                {formatPercentage(card.change)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {card.title}
            </h3>
            <div className="text-2xl font-bold text-foreground">
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">vs período anterior</span>
              <span className={`font-medium ${getChangeColor(card.change)}`}>
                {card.change > 0 ? 'Crecimiento' : card.change < 0 ? 'Descenso' : 'Sin cambios'}
              </span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  card.change > 0 ? 'bg-success' : 
                  card.change < 0 ? 'bg-error' : 'bg-muted-foreground'
                }`}
                style={{
                  width: `${Math.min(Math.abs(card.change) * 2, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;