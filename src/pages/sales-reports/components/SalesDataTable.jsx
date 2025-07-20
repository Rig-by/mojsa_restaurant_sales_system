import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const SalesDataTable = ({ data, onSort, sortConfig }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getSortIconColor = (key) => {
    return sortConfig.key === key ? 'text-primary' : 'text-muted-foreground';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', label: 'Completado' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pendiente' },
      cancelled: { color: 'bg-error text-error-foreground', label: 'Cancelado' }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProfitMarginColor = (margin) => {
    if (margin >= 30) return 'text-success';
    if (margin >= 20) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Datos Detallados de Ventas
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredData.length} elementos encontrados
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              size="sm"
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('itemName')}
                  className="h-auto p-0 font-medium"
                >
                  Producto
                  <Icon 
                    name={getSortIcon('itemName')} 
                    size={16} 
                    className={`ml-2 ${getSortIconColor('itemName')}`}
                  />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Categoría</th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('quantity')}
                  className="h-auto p-0 font-medium"
                >
                  Cantidad
                  <Icon 
                    name={getSortIcon('quantity')} 
                    size={16} 
                    className={`ml-2 ${getSortIconColor('quantity')}`}
                  />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('unitPrice')}
                  className="h-auto p-0 font-medium"
                >
                  Precio Unit.
                  <Icon 
                    name={getSortIcon('unitPrice')} 
                    size={16} 
                    className={`ml-2 ${getSortIconColor('unitPrice')}`}
                  />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('revenue')}
                  className="h-auto p-0 font-medium"
                >
                  Ingresos
                  <Icon 
                    name={getSortIcon('revenue')} 
                    size={16} 
                    className={`ml-2 ${getSortIconColor('revenue')}`}
                  />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Margen</th>
              <th className="text-left p-4 font-medium text-foreground">Sucursal</th>
              <th className="text-left p-4 font-medium text-foreground">Estado</th>
              <th className="text-left p-4 font-medium text-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr 
                key={`${item.id}-${index}`} 
                className="border-b border-border hover:bg-muted/50 transition-colors duration-200"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={item.image}
                      alt={item.itemName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-foreground">{item.itemName}</div>
                      <div className="text-sm text-muted-foreground">#{item.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary rounded-full text-xs">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 font-medium text-foreground">{item.quantity}</td>
                <td className="p-4 font-medium text-foreground">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="p-4 font-semibold text-foreground">
                  {formatCurrency(item.revenue)}
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getProfitMarginColor(item.profitMargin)}`}>
                    {item.profitMargin.toFixed(1)}%
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{item.branch}</td>
                <td className="p-4">{getStatusBadge(item.status)}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(item.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} elementos
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDataTable;