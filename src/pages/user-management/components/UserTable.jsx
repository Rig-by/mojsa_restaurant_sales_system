import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserTable = ({ 
  users, 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onSort, 
  sortField, 
  sortDirection,
  onEdit,
  onViewActivity,
  onToggleStatus,
  onResetPassword
}) => {
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, user: null });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-primary text-primary-foreground';
      case 'manager': return 'bg-accent text-accent-foreground';
      case 'cashier': return 'bg-success text-success-foreground';
      case 'kitchen': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success/10 text-success border-success/20' :'bg-error/10 text-error border-error/20';
  };

  const formatLastLogin = (date) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const loginDate = new Date(date);
    const diffHours = Math.floor((now - loginDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return loginDate.toLocaleDateString('es-ES');
  };

  const handleContextMenu = (e, user) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      user
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, user: null });
  };

  const handleContextAction = (action, user) => {
    switch (action) {
      case 'edit':
        onEdit(user);
        break;
      case 'activity':
        onViewActivity(user);
        break;
      case 'reset':
        onResetPassword(user);
        break;
      case 'toggle':
        onToggleStatus(user);
        break;
    }
    handleCloseContextMenu();
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  React.useEffect(() => {
    const handleClickOutside = () => handleCloseContextMenu();
    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.show]);

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left p-4 font-semibold text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort('name')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <span className="mr-2">Nombre</span>
                  <Icon name={getSortIcon('name')} size={16} />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort('email')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <span className="mr-2">Email</span>
                  <Icon name={getSortIcon('email')} size={16} />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort('role')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <span className="mr-2">Rol</span>
                  <Icon name={getSortIcon('role')} size={16} />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort('branch')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <span className="mr-2">Sucursal</span>
                  <Icon name={getSortIcon('branch')} size={16} />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort('status')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <span className="mr-2">Estado</span>
                  <Icon name={getSortIcon('status')} size={16} />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold text-foreground">
                <Button
                  variant="ghost"
                  onClick={() => onSort('lastLogin')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <span className="mr-2">Último Acceso</span>
                  <Icon name={getSortIcon('lastLogin')} size={16} />
                </Button>
              </th>
              <th className="text-center p-4 font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                onContextMenu={(e) => handleContextMenu(e, user)}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => onSelectUser(user.id, e.target.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'manager' ? 'Gerente' :
                     user.role === 'cashier' ? 'Cajero' : 'Cocina'}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{user.branch}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{formatLastLogin(user.lastLogin)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewActivity(user)}
                      className="h-8 w-8"
                    >
                      <Icon name="Activity" size={14} />
                    </Button>
                    <Button
                      variant={user.status === 'active' ? 'destructive' : 'success'}
                      size="icon"
                      onClick={() => onToggleStatus(user)}
                      className="h-8 w-8"
                    >
                      <Icon name={user.status === 'active' ? 'UserX' : 'UserCheck'} size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-popover border border-border rounded-lg shadow-pronounced z-300 py-1 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleContextAction('edit', contextMenu.user)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors duration-150 flex items-center space-x-2"
          >
            <Icon name="Edit" size={16} />
            <span>Editar Perfil</span>
          </button>
          <button
            onClick={() => handleContextAction('reset', contextMenu.user)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors duration-150 flex items-center space-x-2"
          >
            <Icon name="KeyRound" size={16} />
            <span>Restablecer Contraseña</span>
          </button>
          <button
            onClick={() => handleContextAction('activity', contextMenu.user)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors duration-150 flex items-center space-x-2"
          >
            <Icon name="Activity" size={16} />
            <span>Ver Registro de Actividad</span>
          </button>
          <div className="border-t border-border my-1"></div>
          <button
            onClick={() => handleContextAction('toggle', contextMenu.user)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors duration-150 flex items-center space-x-2 ${
              contextMenu.user?.status === 'active' ? 'text-error' : 'text-success'
            }`}
          >
            <Icon name={contextMenu.user?.status === 'active' ? 'UserX' : 'UserCheck'} size={16} />
            <span>{contextMenu.user?.status === 'active' ? 'Desactivar Usuario' : 'Activar Usuario'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;