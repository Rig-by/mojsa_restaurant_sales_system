import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ metrics }) => {
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

  const MetricCard = ({ title, value, change, icon, description, format = 'currency' }) => {
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'number' ? value.toLocaleString('es-ES') : value;
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-subtle p-6 hover:shadow-moderate transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={icon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
            <Icon name={getChangeIcon(change)} size={16} />
            <span className="text-sm font-medium">{formatPercentage(change)}</span>
          </div>
        </div>
        
        <div className="text-2xl font-bold text-foreground mb-2">
          {formattedValue}
        </div>
        
        <div className="text-xs text-muted-foreground">
          vs período anterior
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Indicadores Clave de Rendimiento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Ingresos Totales"
            value={metrics.totalRevenue}
            change={metrics.revenueChange}
            icon="Euro"
            description="Ventas del período"
            format="currency"
          />
          
          <MetricCard
            title="Pedidos Completados"
            value={metrics.totalOrders}
            change={metrics.ordersChange}
            icon="ShoppingCart"
            description="Órdenes procesadas"
            format="number"
          />
          
          <MetricCard
            title="Ticket Promedio"
            value={metrics.averageTicket}
            change={metrics.ticketChange}
            icon="Receipt"
            description="Valor medio por pedido"
            format="currency"
          />
          
          <MetricCard
            title="Margen de Beneficio"
            value={`${metrics.profitMargin}%`}
            change={metrics.marginChange}
            icon="TrendingUp"
            description="Rentabilidad general"
            format="text"
          />
          
          <MetricCard
            title="Clientes Únicos"
            value={metrics.uniqueCustomers}
            change={metrics.customersChange}
            icon="Users"
            description="Base de clientes"
            format="number"
          />
          
          <MetricCard
            title="Tiempo Promedio"
            value={`${metrics.averageTime} min`}
            change={metrics.timeChange}
            icon="Clock"
            description="Preparación de pedidos"
            format="text"
          />
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Comparación de Rendimiento
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch Performance */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Por Sucursal</h4>
            <div className="space-y-3">
              {metrics.branchPerformance.map((branch, index) => (
                <div key={branch.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{branch.name}</div>
                      <div className="text-sm text-muted-foreground">{branch.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(branch.revenue)}
                    </div>
                    <div className={`text-sm ${getChangeColor(branch.change)}`}>
                      {formatPercentage(branch.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Performance */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Por Horario</h4>
            <div className="space-y-3">
              {metrics.timePerformance.map((period) => (
                <div key={period.period} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{period.period}</div>
                      <div className="text-sm text-muted-foreground">{period.orders} pedidos</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(period.revenue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((period.revenue / metrics.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Insights Rápidos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-success/10 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Mejor Día</h4>
              <p className="text-sm text-muted-foreground">
                {metrics.insights.bestDay.date} con {formatCurrency(metrics.insights.bestDay.revenue)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-accent/10 rounded-lg">
            <Icon name="Star" size={20} className="text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Producto Estrella</h4>
              <p className="text-sm text-muted-foreground">
                {metrics.insights.topProduct.name} - {metrics.insights.topProduct.sales} ventas
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg">
            <Icon name="Clock" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Hora Pico</h4>
              <p className="text-sm text-muted-foreground">
                {metrics.insights.peakHour.time} - {metrics.insights.peakHour.orders} pedidos/hora
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;