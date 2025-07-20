import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserModal = ({ isOpen, onClose, user, onSave, branches }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    branch: '',
    status: 'active',
    permissions: {
      viewReports: false,
      manageMenu: false,
      processOrders: true,
      manageUsers: false,
      viewAnalytics: false,
      exportData: false
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gerente' },
    { value: 'cashier', label: 'Cajero' },
    { value: 'kitchen', label: 'Personal de Cocina' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const branchOptions = branches.map(branch => ({
    value: branch.id,
    label: branch.name
  }));

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'cashier',
        branch: user.branchId || '',
        status: user.status || 'active',
        permissions: user.permissions || {
          viewReports: false,
          manageMenu: false,
          processOrders: true,
          manageUsers: false,
          viewAnalytics: false,
          exportData: false
        }
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'cashier',
        branch: '',
        status: 'active',
        permissions: {
          viewReports: false,
          manageMenu: false,
          processOrders: true,
          manageUsers: false,
          viewAnalytics: false,
          exportData: false
        }
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.branch) {
      newErrors.branch = 'La sucursal es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave({
        ...formData,
        id: user?.id || Date.now()
      });
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case 'admin':
        return {
          viewReports: true,
          manageMenu: true,
          processOrders: true,
          manageUsers: true,
          viewAnalytics: true,
          exportData: true
        };
      case 'manager':
        return {
          viewReports: true,
          manageMenu: true,
          processOrders: true,
          manageUsers: false,
          viewAnalytics: true,
          exportData: true
        };
      case 'cashier':
        return {
          viewReports: false,
          manageMenu: false,
          processOrders: true,
          manageUsers: false,
          viewAnalytics: false,
          exportData: false
        };
      case 'kitchen':
        return {
          viewReports: false,
          manageMenu: false,
          processOrders: true,
          manageUsers: false,
          viewAnalytics: false,
          exportData: false
        };
      default:
        return formData.permissions;
    }
  };

  const handleRoleChange = (role) => {
    const defaultPermissions = getDefaultPermissions(role);
    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
                placeholder="Ingrese el nombre completo"
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
                placeholder="usuario@mojsa.com"
              />
            </div>

            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              required
              placeholder="+34 600 000 000"
            />
          </div>

          {/* Role and Branch */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Asignación de Rol</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Rol"
                options={roleOptions}
                value={formData.role}
                onChange={(value) => handleRoleChange(value)}
                required
              />
              
              <Select
                label="Sucursal"
                options={branchOptions}
                value={formData.branch}
                onChange={(value) => handleInputChange('branch', value)}
                error={errors.branch}
                required
              />
            </div>

            <Select
              label="Estado"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
            />
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Permisos del Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="Ver Reportes"
                description="Acceso a reportes de ventas y análisis"
                checked={formData.permissions.viewReports}
                onChange={(e) => handlePermissionChange('viewReports', e.target.checked)}
              />
              
              <Checkbox
                label="Gestionar Menú"
                description="Crear y editar elementos del menú"
                checked={formData.permissions.manageMenu}
                onChange={(e) => handlePermissionChange('manageMenu', e.target.checked)}
              />
              
              <Checkbox
                label="Procesar Pedidos"
                description="Crear y gestionar pedidos de clientes"
                checked={formData.permissions.processOrders}
                onChange={(e) => handlePermissionChange('processOrders', e.target.checked)}
              />
              
              <Checkbox
                label="Gestionar Usuarios"
                description="Administrar cuentas de usuario"
                checked={formData.permissions.manageUsers}
                onChange={(e) => handlePermissionChange('manageUsers', e.target.checked)}
              />
              
              <Checkbox
                label="Ver Análisis"
                description="Acceso a dashboards y métricas"
                checked={formData.permissions.viewAnalytics}
                onChange={(e) => handlePermissionChange('viewAnalytics', e.target.checked)}
              />
              
              <Checkbox
                label="Exportar Datos"
                description="Descargar reportes y datos"
                checked={formData.permissions.exportData}
                onChange={(e) => handlePermissionChange('exportData', e.target.checked)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              iconName="Save"
              iconPosition="left"
            >
              {user ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;