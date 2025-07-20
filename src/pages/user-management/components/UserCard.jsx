import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, onEdit, onViewActivity, onToggleStatus, onResetPassword }) => {
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

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-subtle hover:shadow-moderate transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {user.role === 'admin' ? 'Administrador' : 
             user.role === 'manager' ? 'Gerente' :
             user.role === 'cashier' ? 'Cajero' : 'Cocina'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
            {user.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} className="mr-2" />
          <span>{user.branch}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="Clock" size={16} className="mr-2" />
          <span>Último acceso: {formatLastLogin(user.lastLogin)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            iconName="Edit"
            iconPosition="left"
            iconSize={14}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewActivity(user)}
            iconName="Activity"
            iconPosition="left"
            iconSize={14}
          >
            Actividad
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onResetPassword(user)}
            className="h-8 w-8"
          >
            <Icon name="KeyRound" size={14} />
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
      </div>
    </div>
  );
};

export default UserCard;