import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserFilters = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange,
  branchFilter,
  onBranchFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  branches 
}) => {
  const roleOptions = [
    { value: 'all', label: 'Todos los Roles' },
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gerente' },
    { value: 'cashier', label: 'Cajero' },
    { value: 'kitchen', label: 'Personal de Cocina' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' }
  ];

  const branchOptions = [
    { value: 'all', label: 'Todas las Sucursales' },
    ...branches.map(branch => ({
      value: branch.id,
      label: branch.name
    }))
  ];

  const hasActiveFilters = searchTerm || roleFilter !== 'all' || branchFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-subtle">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <div className="min-w-48">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={onRoleFilterChange}
              placeholder="Filtrar por rol"
            />
          </div>

          <div className="min-w-48">
            <Select
              options={branchOptions}
              value={branchFilter}
              onChange={onBranchFilterChange}
              placeholder="Filtrar por sucursal"
            />
          </div>

          <div className="min-w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filtrar por estado"
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="whitespace-nowrap"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {roleFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
                Rol: {roleOptions.find(r => r.value === roleFilter)?.label}
                <button
                  onClick={() => onRoleFilterChange('all')}
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {branchFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary border border-secondary/20">
                Sucursal: {branchOptions.find(b => b.value === branchFilter)?.label}
                <button
                  onClick={() => onBranchFilterChange('all')}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success/10 text-success border border-success/20">
                Estado: {statusOptions.find(s => s.value === statusFilter)?.label}
                <button
                  onClick={() => onStatusFilterChange('all')}
                  className="ml-1 hover:bg-success/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;