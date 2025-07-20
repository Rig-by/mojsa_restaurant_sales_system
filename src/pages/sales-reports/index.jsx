import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FilterControls from './components/FilterControls';
import SummaryCards from './components/SummaryCards';
import RevenueChart from './components/RevenueChart';
import TopSellingItems from './components/TopSellingItems';
import PerformanceMetrics from './components/PerformanceMetrics';
import SalesDataTable from './components/SalesDataTable';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SalesReports = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2025-01-01',
    dateTo: '2025-01-20',
    branch: 'all',
    reportType: 'daily',
    category: 'all',
    paymentMethod: 'all',
    staff: 'all'
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'revenue',
    direction: 'desc'
  });

  const [chartType, setChartType] = useState('line');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for revenue chart
  const revenueData = [
    { date: '2025-01-01', revenue: 2450, orders: 45 },
    { date: '2025-01-02', revenue: 3200, orders: 58 },
    { date: '2025-01-03', revenue: 2800, orders: 52 },
    { date: '2025-01-04', revenue: 3600, orders: 67 },
    { date: '2025-01-05', revenue: 4200, orders: 78 },
    { date: '2025-01-06', revenue: 3900, orders: 71 },
    { date: '2025-01-07', revenue: 3400, orders: 62 },
    { date: '2025-01-08', revenue: 2900, orders: 54 },
    { date: '2025-01-09', revenue: 3800, orders: 69 },
    { date: '2025-01-10', revenue: 4100, orders: 75 },
    { date: '2025-01-11', revenue: 3700, orders: 68 },
    { date: '2025-01-12', revenue: 4500, orders: 82 },
    { date: '2025-01-13', revenue: 4800, orders: 87 },
    { date: '2025-01-14', revenue: 4200, orders: 76 },
    { date: '2025-01-15', revenue: 3900, orders: 72 },
    { date: '2025-01-16', revenue: 4300, orders: 79 },
    { date: '2025-01-17', revenue: 4600, orders: 84 },
    { date: '2025-01-18', revenue: 4100, orders: 75 },
    { date: '2025-01-19', revenue: 3800, orders: 70 },
    { date: '2025-01-20', revenue: 4400, orders: 81 }
  ];

  // Mock data for top selling items
  const topSellingData = [
    {
      id: 1,
      name: 'Paella Valenciana',
      category: 'Platos Principales',
      quantity: 156,
      revenue: 2340,
      image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400'
    },
    {
      id: 2,
      name: 'Jamón Ibérico',
      category: 'Aperitivos',
      quantity: 134,
      revenue: 2010,
      image: 'https://images.unsplash.com/photo-1549611012-30f3c5d5e0bb?w=400'
    },
    {
      id: 3,
      name: 'Gazpacho Andaluz',
      category: 'Aperitivos',
      quantity: 98,
      revenue: 1470,
      image: 'https://images.unsplash.com/photo-1571197119282-7c4d9e8c4c1f?w=400'
    },
    {
      id: 4,
      name: 'Tortilla Española',
      category: 'Platos Principales',
      quantity: 87,
      revenue: 1305,
      image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400'
    },
    {
      id: 5,
      name: 'Crema Catalana',
      category: 'Postres',
      quantity: 76,
      revenue: 912,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'
    },
    {
      id: 6,
      name: 'Sangría Tradicional',
      category: 'Bebidas',
      quantity: 145,
      revenue: 1160,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'
    },
    {
      id: 7,
      name: 'Pulpo a la Gallega',
      category: 'Aperitivos',
      quantity: 65,
      revenue: 1300,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    },
    {
      id: 8,
      name: 'Churros con Chocolate',
      category: 'Postres',
      quantity: 89,
      revenue: 712,
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=400'
    }
  ];

  // Mock summary data
  const summaryData = {
    totalRevenue: 74500,
    revenueChange: 12.5,
    totalOrders: 1342,
    ordersChange: 8.3,
    uniqueCustomers: 892,
    customersChange: 15.2,
    averageTicket: 55.52,
    ticketChange: 3.8
  };

  // Mock performance metrics
  const performanceMetrics = {
    totalRevenue: 74500,
    revenueChange: 12.5,
    totalOrders: 1342,
    ordersChange: 8.3,
    averageTicket: 55.52,
    ticketChange: 3.8,
    profitMargin: 28.5,
    marginChange: 2.1,
    uniqueCustomers: 892,
    customersChange: 15.2,
    averageTime: 18,
    timeChange: -5.2,
    branchPerformance: [
      { id: 1, name: 'Sucursal Centro', location: 'Av. Principal 123', revenue: 28500, change: 15.3 },
      { id: 2, name: 'Sucursal Norte', location: 'Calle Norte 456', revenue: 22300, change: 8.7 },
      { id: 3, name: 'Sucursal Sur', location: 'Av. Sur 789', revenue: 18200, change: 12.1 },
      { id: 4, name: 'Sucursal Este', location: 'Plaza Este 321', revenue: 5500, change: -2.4 }
    ],
    timePerformance: [
      { period: 'Desayuno (8:00-11:00)', orders: 234, revenue: 12400 },
      { period: 'Almuerzo (12:00-16:00)', orders: 567, revenue: 34200 },
      { period: 'Merienda (17:00-19:00)', orders: 189, revenue: 9800 },
      { period: 'Cena (20:00-23:00)', orders: 352, revenue: 18100 }
    ],
    insights: {
      bestDay: { date: '13/01/2025', revenue: 4800 },
      topProduct: { name: 'Paella Valenciana', sales: 156 },
      peakHour: { time: '13:00-14:00', orders: 45 }
    }
  };

  // Mock detailed sales data
  const salesData = [
    {
      id: 'ORD-001',
      itemName: 'Paella Valenciana',
      category: 'Platos Principales',
      quantity: 2,
      unitPrice: 15.00,
      revenue: 30.00,
      profitMargin: 32.5,
      branch: 'Sucursal Centro',
      status: 'completed',
      date: '2025-01-20T13:45:00',
      image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400'
    },
    {
      id: 'ORD-002',
      itemName: 'Jamón Ibérico',
      category: 'Aperitivos',
      quantity: 1,
      unitPrice: 18.50,
      revenue: 18.50,
      profitMargin: 45.2,
      branch: 'Sucursal Norte',
      status: 'completed',
      date: '2025-01-20T12:30:00',
      image: 'https://images.unsplash.com/photo-1549611012-30f3c5d5e0bb?w=400'
    },
    {
      id: 'ORD-003',
      itemName: 'Gazpacho Andaluz',
      category: 'Aperitivos',
      quantity: 3,
      unitPrice: 8.00,
      revenue: 24.00,
      profitMargin: 28.7,
      branch: 'Sucursal Sur',
      status: 'completed',
      date: '2025-01-20T14:15:00',
      image: 'https://images.unsplash.com/photo-1571197119282-7c4d9e8c4c1f?w=400'
    },
    {
      id: 'ORD-004',
      itemName: 'Tortilla Española',
      category: 'Platos Principales',
      quantity: 1,
      unitPrice: 12.00,
      revenue: 12.00,
      profitMargin: 35.8,
      branch: 'Sucursal Centro',
      status: 'pending',
      date: '2025-01-20T15:20:00',
      image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400'
    },
    {
      id: 'ORD-005',
      itemName: 'Sangría Tradicional',
      category: 'Bebidas',
      quantity: 2,
      unitPrice: 6.50,
      revenue: 13.00,
      profitMargin: 52.3,
      branch: 'Sucursal Este',
      status: 'completed',
      date: '2025-01-20T16:45:00',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'
    },
    {
      id: 'ORD-006',
      itemName: 'Crema Catalana',
      category: 'Postres',
      quantity: 4,
      unitPrice: 7.50,
      revenue: 30.00,
      profitMargin: 41.2,
      branch: 'Sucursal Norte',
      status: 'completed',
      date: '2025-01-20T18:10:00',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'
    },
    {
      id: 'ORD-007',
      itemName: 'Pulpo a la Gallega',
      category: 'Aperitivos',
      quantity: 1,
      unitPrice: 22.00,
      revenue: 22.00,
      profitMargin: 38.6,
      branch: 'Sucursal Sur',
      status: 'completed',
      date: '2025-01-20T19:30:00',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    },
    {
      id: 'ORD-008',
      itemName: 'Churros con Chocolate',
      category: 'Postres',
      quantity: 2,
      unitPrice: 5.50,
      revenue: 11.00,
      profitMargin: 29.1,
      branch: 'Sucursal Centro',
      status: 'cancelled',
      date: '2025-01-20T20:15:00',
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=400'
    }
  ];

  const handleFiltersChange = (newFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type} report with filters:`, filters);
    // Implement export functionality
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16 pb-20 lg:pb-8">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Reportes de Ventas
                </h1>
                <p className="text-muted-foreground">
                  Análisis completo del rendimiento de ventas de Mojsa
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Calendar" size={16} />
              <span>Última actualización: {new Date().toLocaleString('es-ES')}</span>
            </div>
          </div>

          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Actualizando datos...</span>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Summary Cards */}
              <SummaryCards summaryData={summaryData} />

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="xl:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Análisis de Tendencias
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={chartType === 'line' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('line')}
                        iconName="TrendingUp"
                        iconPosition="left"
                      >
                        Líneas
                      </Button>
                      <Button
                        variant={chartType === 'area' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('area')}
                        iconName="AreaChart"
                        iconPosition="left"
                      >
                        Área
                      </Button>
                    </div>
                  </div>
                  <RevenueChart
                    data={revenueData}
                    chartType={chartType}
                    period={filters.reportType}
                  />
                </div>

                {/* Top Selling Items */}
                <div>
                  <TopSellingItems data={topSellingData} viewType="bar" />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mb-8">
                <PerformanceMetrics metrics={performanceMetrics} />
              </div>

              {/* Detailed Sales Data */}
              <div>
                <SalesDataTable
                  data={salesData}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SalesReports;