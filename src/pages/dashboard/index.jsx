import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import KPICard from './components/KPICard';
import OrderQueueWidget from './components/OrderQueueWidget';
import SalesTrendChart from './components/SalesTrendChart';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentActivityFeed from './components/RecentActivityFeed';
import BranchPerformanceWidget from './components/BranchPerformanceWidget';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user || !userProfile) {
    return null;
  }

  const userRole = userProfile?.role || 'cashier';
  const branchName = userProfile?.branch?.name || 'Sin sucursal asignada';

  // Mock KPI data
  const kpiData = [
    {
      title: "Ventas de Hoy",
      value: "€3,245.50",
      change: "+12.5%",
      changeType: "positive",
      icon: "Euro",
      color: "bg-primary",
      onClick: () => navigate('/sales-reports')
    },
    {
      title: "Pedidos Activos",
      value: "24",
      change: "+3",
      changeType: "positive", 
      icon: "ShoppingCart",
      color: "bg-accent",
      onClick: () => navigate('/order-management')
    },
    {
      title: "Ticket Medio",
      value: "€18.75",
      change: "-2.1%",
      changeType: "negative",
      icon: "TrendingUp",
      color: "bg-success"
    },
    {
      title: "Mesas Ocupadas",
      value: "18/24",
      change: "75%",
      changeType: "positive",
      icon: "Users",
      color: "bg-secondary"
    }
  ];

  // Role-based content filtering
  const getRoleBasedKPIs = () => {
    switch (userRole) {
      case 'cashier':
        return kpiData.slice(0, 2); // Only sales and orders
      case 'kitchen':
        return [kpiData[1], kpiData[3]]; // Only orders and tables
      case 'manager':
        return kpiData.slice(0, 3); // All except tables
      default:
        return kpiData; // All KPIs for admin
    }
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      {/* Main Content */}
      <main className="lg:ml-60 pt-16 pb-20 lg:pb-8">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Panel de Control
                </h1>
                <p className="text-muted-foreground">
                  Bienvenido {userProfile?.full_name} - {branchName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Rol: {userProfile?.role === 'admin' ? 'Administrador' : 
                        userProfile?.role === 'manager' ? 'Gerente' :
                        userProfile?.role === 'cashier' ? 'Cajero' : 'Cocina'}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>{formatCurrentTime()}</span>
                </div>
                <Button variant="outline" iconName="RefreshCw" iconPosition="left">
                  Actualizar
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getRoleBasedKPIs().map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                color={kpi.color}
                onClick={kpi.onClick}
              />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Charts and Orders */}
            <div className="xl:col-span-2 space-y-8">
              {/* Sales Trend Chart */}
              <SalesTrendChart />
              
              {/* Order Queue - Show for all roles except admin in some cases */}
              {(userRole !== 'admin' || true) && <OrderQueueWidget />}
              
              {/* Branch Performance - Admin only */}
              {userRole === 'admin' && <BranchPerformanceWidget />}
            </div>

            {/* Right Column - Quick Actions and Activity */}
            <div className="space-y-8">
              <QuickActionsPanel />
              <RecentActivityFeed />
            </div>
          </div>

          {/* Bottom Section - Additional Widgets */}
          {userRole === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Summary */}
              <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resumen de Rendimiento</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Target" size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Objetivo Mensual</p>
                        <p className="text-sm text-muted-foreground">€85,000</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">€67,250</p>
                      <p className="text-sm text-success">79% completado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Users" size={20} className="text-accent" />
                      <div>
                        <p className="font-medium text-foreground">Clientes Atendidos</p>
                        <p className="text-sm text-muted-foreground">Hoy</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">173</p>
                      <p className="text-sm text-success">+8% vs ayer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Alertas del Sistema</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Stock Bajo</p>
                      <p className="text-xs text-warning/80">Jamón Ibérico - Solo 3 unidades restantes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                    <Icon name="Wifi" size={16} className="text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-error">Conexión Lenta</p>
                      <p className="text-xs text-error/80">Sucursal Norte reporta problemas de conectividad</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-success">Backup Completado</p>
                      <p className="text-xs text-success/80">Copia de seguridad realizada a las 02:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;