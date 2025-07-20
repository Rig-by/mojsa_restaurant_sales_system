import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueChart = ({ data, chartType = 'line', period = 'daily' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    switch (period) {
      case 'daily':
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      case 'weekly':
        return `Sem ${date.getWeek()}`;
      case 'monthly':
        return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      default:
        return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-pronounced p-3">
          <p className="font-medium text-sm mb-2">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / data.length;
  const maxRevenue = Math.max(...data.map(item => item.revenue));
  const minRevenue = Math.min(...data.map(item => item.revenue));

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Tendencia de Ingresos
          </h3>
          <p className="text-sm text-muted-foreground">
            Evolución de ventas por período seleccionado
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-success" />
          <span className="text-sm font-medium text-success">
            +12.5% vs período anterior
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(30, 58, 138)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(30, 58, 138)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(226, 232, 240)" />
              <XAxis 
                dataKey="date" 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="rgb(30, 58, 138)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Ingresos"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(226, 232, 240)" />
              <XAxis 
                dataKey="date" 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="rgb(30, 58, 138)"
                strokeWidth={3}
                dot={{ fill: 'rgb(30, 58, 138)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'rgb(30, 58, 138)', strokeWidth: 2 }}
                name="Ingresos"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="rgb(245, 158, 11)"
                strokeWidth={2}
                dot={{ fill: 'rgb(245, 158, 11)', strokeWidth: 2, r: 3 }}
                name="Pedidos"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(avgRevenue)}
          </div>
          <div className="text-xs text-muted-foreground">Promedio</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {formatCurrency(maxRevenue)}
          </div>
          <div className="text-xs text-muted-foreground">Máximo</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-error">
            {formatCurrency(minRevenue)}
          </div>
          <div className="text-xs text-muted-foreground">Mínimo</div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get week number
Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default RevenueChart;