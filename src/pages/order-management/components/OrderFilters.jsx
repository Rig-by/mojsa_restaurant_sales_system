import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  orderTypeFilter,
  onOrderTypeFilterChange,
  onRefresh,
  isRefreshing 
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'preparing', label: 'En Preparación' },
    { value: 'ready', label: 'Listos' },
    { value: 'completed', label: 'Completados' }
  ];

  const dateOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'all', label: 'Todos' }
  ];

  const orderTypeOptions = [
    { value: 'all', label: 'Todos los Tipos' },
    { value: 'delivery', label: 'Entrega a Domicilio' },
    { value: 'pickup', label: 'Recogida en Tienda' }
  ];

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onDateFilterChange('today');
    onOrderTypeFilterChange('all');
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Buscar por número de pedido o cliente..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="min-w-40"
          />
          
          <Select
            options={orderTypeOptions}
            value={orderTypeFilter}
            onChange={onOrderTypeFilterChange}
            className="min-w-40"
          />
          
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={onDateFilterChange}
            className="min-w-32"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            iconName="X"
            iconPosition="left"
            size="sm"
          >
            Limpiar
          </Button>
          
          <Button
            variant="outline"
            onClick={onRefresh}
            loading={isRefreshing}
            iconName="RotateCcw"
            iconPosition="left"
            size="sm"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-warning">12</div>
          <div className="text-xs text-muted-foreground">Pendientes</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-primary">8</div>
          <div className="text-xs text-muted-foreground">Preparando</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-success">5</div>
          <div className="text-xs text-muted-foreground">Listos</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-muted-foreground">43</div>
          <div className="text-xs text-muted-foreground">Completados</div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;