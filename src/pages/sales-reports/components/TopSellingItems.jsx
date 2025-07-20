import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopSellingItems = ({ data, viewType = 'bar' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const colors = [
    'rgb(30, 58, 138)',   // blue-800
    'rgb(245, 158, 11)',  // amber-500
    'rgb(5, 150, 105)',   // emerald-600
    'rgb(220, 38, 38)',   // red-600
    'rgb(147, 51, 234)',  // purple-600
    'rgb(219, 39, 119)',  // pink-600
    'rgb(59, 130, 246)',  // blue-500
    'rgb(16, 185, 129)',  // emerald-500
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-pronounced p-3 max-w-xs">
          <div className="flex items-center space-x-3 mb-2">
            <Image
              src={data.image}
              alt={data.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-sm">{data.name}</p>
              <p className="text-xs text-muted-foreground">{data.category}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cantidad:</span>
              <span className="font-medium">{data.quantity} unidades</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ingresos:</span>
              <span className="font-medium">{formatCurrency(data.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio promedio:</span>
              <span className="font-medium">{formatCurrency(data.revenue / data.quantity)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Productos Más Vendidos
          </h3>
          <p className="text-sm text-muted-foreground">
            Top 8 productos por ingresos generados
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Award" size={20} className="text-accent" />
          <span className="text-sm font-medium text-accent">
            {data.length} productos analizados
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="revenue"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(226, 232, 240)" />
              <XAxis 
                dataKey="name" 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="rgb(30, 58, 138)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Top Items List */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Ranking Detallado</h4>
        {data.slice(0, 5).map((item, index) => (
          <div key={item.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
              {index + 1}
            </div>
            
            <Image
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-foreground truncate">{item.name}</h5>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-foreground">
                {formatCurrency(item.revenue)}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.quantity} unidades
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-accent">
                {((item.revenue / totalRevenue) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">del total</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-xs text-muted-foreground">Ingresos Totales</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">
            {totalQuantity}
          </div>
          <div className="text-xs text-muted-foreground">Unidades Vendidas</div>
        </div>
        <div className="text-center md:col-span-1 col-span-2">
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalRevenue / totalQuantity)}
          </div>
          <div className="text-xs text-muted-foreground">Precio Promedio</div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingItems;