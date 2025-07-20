import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ filters, onFiltersChange, onExport }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const branchOptions = [
    { value: 'all', label: 'Todas las Sucursales' },
    { value: 'centro', label: 'Sucursal Centro' },
    { value: 'norte', label: 'Sucursal Norte' },
    { value: 'sur', label: 'Sucursal Sur' },
    { value: 'este', label: 'Sucursal Este' }
  ];

  const reportTypeOptions = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'quarterly', label: 'Trimestral' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'appetizers', label: 'Aperitivos' },
    { value: 'main-courses', label: 'Platos Principales' },
    { value: 'desserts', label: 'Postres' },
    { value: 'beverages', label: 'Bebidas' },
    { value: 'specials', label: 'Especialidades' }
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'Todos los Métodos' },
    { value: 'cash', label: 'Efectivo' },
    { value: 'card', label: 'Tarjeta' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'digital', label: 'Pago Digital' }
  ];

  const staffOptions = [
    { value: 'all', label: 'Todo el Personal' },
    { value: 'maria', label: 'María González' },
    { value: 'carlos', label: 'Carlos Rodríguez' },
    { value: 'ana', label: 'Ana López' },
    { value: 'pedro', label: 'Pedro Martín' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateFrom: '',
      dateTo: '',
      branch: 'all',
      reportType: 'daily',
      category: 'all',
      paymentMethod: 'all',
      staff: 'all'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle p-6 mb-6">
      {/* Main Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              label="Fecha Desde"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="text-sm"
            />
            <Input
              type="date"
              label="Fecha Hasta"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        <Select
          label="Sucursal"
          options={branchOptions}
          value={filters.branch}
          onChange={(value) => handleFilterChange('branch', value)}
        />

        <Select
          label="Tipo de Reporte"
          options={reportTypeOptions}
          value={filters.reportType}
          onChange={(value) => handleFilterChange('reportType', value)}
        />

        <Select
          label="Categoría"
          options={categoryOptions}
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        <div className="flex items-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="flex-1"
          >
            Filtros Avanzados
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Select
              label="Método de Pago"
              options={paymentMethodOptions}
              value={filters.paymentMethod}
              onChange={(value) => handleFilterChange('paymentMethod', value)}
            />

            <Select
              label="Personal"
              options={staffOptions}
              value={filters.staff}
              onChange={(value) => handleFilterChange('staff', value)}
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                iconName="RotateCcw"
                iconPosition="left"
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>
            Período: {filters.dateFrom || 'Sin fecha'} - {filters.dateTo || 'Sin fecha'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onExport('pdf')}
            iconName="FileText"
            iconPosition="left"
            size="sm"
          >
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport('csv')}
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport('email')}
            iconName="Mail"
            iconPosition="left"
            size="sm"
          >
            Enviar por Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;