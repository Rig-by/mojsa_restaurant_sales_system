import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!userProfile?.full_name) return 'U';
    return userProfile.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      manager: 'Gerente',
      cashier: 'Cajero',
      kitchen: 'Cocina'
    };
    return roleNames[role] || 'Usuario';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => {
              // Toggle sidebar - this would be handled by a sidebar context
            }}
          >
            <Icon name="Menu" size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Mojsa</h1>
              <p className="text-xs text-muted-foreground">Sistema de Ventas</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Icon name="Search" size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos, pedidos, clientes..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={() => navigate('/order-management')}
              className="text-muted-foreground hover:text-foreground"
            >
              Pedido
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Icon name="Bell" size={20} className="text-muted-foreground" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-foreground">Notificaciones</h3>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div key={index} className="p-4 hover:bg-muted border-b border-border last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {userProfile?.full_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplayName(userProfile?.role)}
                </p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">{userProfile?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {userProfile?.branch?.name || 'Sin sucursal'}
                  </p>
                </div>
                
                <div className="py-2">
                  <button
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile page
                    }}
                  >
                    <Icon name="User" size={16} />
                    <span>Mi Perfil</span>
                  </button>
                  
                  <button
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to settings
                    }}
                  >
                    <Icon name="Settings" size={16} />
                    <span>Configuración</span>
                  </button>
                  
                  <button
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Show help
                    }}
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Ayuda</span>
                  </button>
                </div>
                
                <div className="border-t border-border py-2">
                  <button
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-muted transition-colors"
                    onClick={handleLogout}
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;