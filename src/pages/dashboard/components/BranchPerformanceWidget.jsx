import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BranchPerformanceWidget = () => {
  const [selectedMetric, setSelectedMetric] = useState('sales');

  const branchData = [
    {
      id: 1,
      name: 'Sucursal Centro Puno',
      address: 'Av. Principal 123',
      sales: 4250,
      orders: 285,
      avgOrder: 14.91,
      growth: 12.5,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sucursal Norte',
      address: 'Calle Norte 456',
      sales: 3680,
      orders: 245,
      avgOrder: 15.02,
      growth: 8.3,
      status: 'active'
    },
    {
      id: 3,
      name: 'Sucursal Sur',
      address: 'Av. Sur 789',
      sales: 3920,
      orders: 268,
      avgOrder: 14.63,
      growth: -2.1,
      status: 'active'
    },
    {
      id: 4,
      name: 'Sucursal Este',
      address: 'Plaza Este 321',
      sales: 2890,
      orders: 198,
      avgOrder: 14.60,
      growth: 15.7,
      status: 'active'
    }
  ];

  const metrics = [
    { key: 'sales', label: 'Ventas', icon: 'Euro', format: (value) => `€${value}` },
    { key: 'orders', label: 'Pedidos', icon: 'ShoppingCart', format: (value) => value },
    { key: 'avgOrder', label: 'Ticket Medio', icon: 'TrendingUp', format: (value) => `€${value.toFixed(2)}` }
  ];

  const getChartData = () => {
    return branchData.map(branch => ({
      name: branch.name.replace('Sucursal ', ''),
      value: branch[selectedMetric],
      fullName: branch.name
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const metric = metrics.find(m => m.key === selectedMetric);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-pronounced">
          <p className="font-medium text-popover-foreground mb-1">{payload[0].payload.fullName}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {metric.label}: {metric.format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getBestPerformer = () => {
    return branchData.reduce((best, current) => 
      current[selectedMetric] > best[selectedMetric] ? current : best
    );
  };

  const getWorstPerformer = () => {
    return branchData.reduce((worst, current) => 
      current[selectedMetric] < worst[selectedMetric] ? current : worst
    );
  };

  const bestPerformer = getBestPerformer();
  const worstPerformer = getWorstPerformer();

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Rendimiento por Sucursal</h3>
          <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
            Ver Detalle
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedMetric === metric.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={metric.icon} size={16} />
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => {
                  const metric = metrics.find(m => m.key === selectedMetric);
                  return metric.format(value);
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={16} className="text-success-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-success">Mejor Rendimiento</p>
                <p className="text-xs text-success/80">{bestPerformer.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-success">
                {metrics.find(m => m.key === selectedMetric).format(bestPerformer[selectedMetric])}
              </span>
              <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                +{bestPerformer.growth}%
              </span>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
                <Icon name="TrendingDown" size={16} className="text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-warning">Necesita Atención</p>
                <p className="text-xs text-warning/80">{worstPerformer.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-warning">
                {metrics.find(m => m.key === selectedMetric).format(worstPerformer[selectedMetric])}
              </span>
              <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded-full">
                {worstPerformer.growth > 0 ? '+' : ''}{worstPerformer.growth}%
              </span>
            </div>
          </div>
        </div>

        {/* Branch List */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-foreground mb-3">Todas las Sucursales</h4>
          {branchData.map((branch) => (
            <div key={branch.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {metrics.find(m => m.key === selectedMetric).format(branch[selectedMetric])}
                </p>
                <p className={`text-xs ${branch.growth >= 0 ? 'text-success' : 'text-error'}`}>
                  {branch.growth >= 0 ? '+' : ''}{branch.growth}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchPerformanceWidget;