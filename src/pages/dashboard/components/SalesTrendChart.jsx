import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SalesTrendChart = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [chartType, setChartType] = useState('line');

  const dailyData = [
    { name: '09:00', ventas: 120, pedidos: 8 },
    { name: '10:00', ventas: 180, pedidos: 12 },
    { name: '11:00', ventas: 250, pedidos: 15 },
    { name: '12:00', ventas: 420, pedidos: 28 },
    { name: '13:00', ventas: 680, pedidos: 45 },
    { name: '14:00', ventas: 890, pedidos: 58 },
    { name: '15:00', ventas: 650, pedidos: 42 },
    { name: '16:00', ventas: 380, pedidos: 25 },
    { name: '17:00', ventas: 290, pedidos: 18 }
  ];

  const weeklyData = [
    { name: 'Lun', ventas: 2450, pedidos: 165 },
    { name: 'Mar', ventas: 2680, pedidos: 178 },
    { name: 'Mié', ventas: 2890, pedidos: 195 },
    { name: 'Jue', ventas: 3120, pedidos: 210 },
    { name: 'Vie', ventas: 3850, pedidos: 258 },
    { name: 'Sáb', ventas: 4200, pedidos: 285 },
    { name: 'Dom', ventas: 3650, pedidos: 245 }
  ];

  const monthlyData = [
    { name: 'Ene', ventas: 18500, pedidos: 1250 },
    { name: 'Feb', ventas: 19200, pedidos: 1320 },
    { name: 'Mar', ventas: 21800, pedidos: 1450 },
    { name: 'Abr', ventas: 23500, pedidos: 1580 },
    { name: 'May', ventas: 25200, pedidos: 1680 },
    { name: 'Jun', ventas: 27800, pedidos: 1850 }
  ];

  const getData = () => {
    switch (timeRange) {
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const formatValue = (value) => {
    if (timeRange === 'monthly') {
      return `€${(value / 1000).toFixed(1)}k`;
    }
    return `€${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-pronounced">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'ventas' ? 'Ventas' : 'Pedidos'}: {
                entry.dataKey === 'ventas' ? formatValue(entry.value) : entry.value
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeRanges = [
    { key: 'daily', label: 'Hoy', icon: 'Clock' },
    { key: 'weekly', label: 'Semana', icon: 'Calendar' },
    { key: 'monthly', label: 'Mes', icon: 'CalendarDays' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Tendencia de Ventas</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
            />
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                timeRange === range.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={range.icon} size={16} />
              <span>{range.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={getData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={formatValue}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={getData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={formatValue}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="ventas" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Ventas en Euros</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="ShoppingCart" size={16} />
            <span>Total de Pedidos: {getData().reduce((sum, item) => sum + item.pedidos, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendChart;