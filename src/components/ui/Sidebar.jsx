import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications] = useState({
    orders: 3,
    reports: 0,
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      requiredRole: 'all',
      tooltip: 'Panel Principal'
    },
    {
      id: 'orders',
      label: 'Gestión de Pedidos',
      path: '/order-management',
      icon: 'ShoppingCart',
      requiredRole: 'all',
      tooltip: 'Gestión de Pedidos',
      notificationCount: notifications.orders
    },
    {
      id: 'menu',
      label: 'Gestión de Menú',
      path: '/menu-management',
      icon: 'UtensilsCrossed',
      requiredRole: 'admin',
      tooltip: 'Gestión de Menú'
    },
    {
      id: 'reports',
      label: 'Reportes de Ventas',
      path: '/sales-reports',
      icon: 'BarChart3',
      requiredRole: 'admin',
      tooltip: 'Reportes de Ventas',
      notificationCount: notifications.reports
    },
    {
      id: 'users',
      label: 'Gestión de Usuarios',
      path: '/user-management',
      icon: 'Users',
      requiredRole: 'admin',
      tooltip: 'Gestión de Usuarios'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border shadow-subtle z-100 transition-all duration-300 ease-out ${
        isCollapsed ? 'w-16' : 'w-60'
      } hidden lg:block`}>
        
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-center"
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={20} 
            />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                className={`w-full justify-start h-12 ${
                  isCollapsed ? 'px-3' : 'px-4'
                } transition-all duration-200`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="relative">
                    <Icon name={item.icon} size={20} />
                    {item.notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {item.notificationCount}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </div>
              </Button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-pronounced opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-200">
                  {item.tooltip}
                  {item.notificationCount > 0 && (
                    <span className="ml-2 bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                      {item.notificationCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Última actualización
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-pronounced z-300">
        <div className="flex items-center justify-around h-16 px-2">
          {menuItems.slice(0, 5).map((item) => (
            <Button
              key={item.id}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="icon"
              onClick={() => handleNavigation(item.path)}
              className="relative flex-1 h-12 max-w-16"
            >
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  <Icon name={item.icon} size={18} />
                  {item.notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                      {item.notificationCount > 9 ? '9+' : item.notificationCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium leading-none">
                  {item.label.split(' ')[0]}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;