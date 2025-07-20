import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserTable from './components/UserTable';
import UserCard from './components/UserCard';
import UserModal from './components/UserModal';
import ActivityModal from './components/ActivityModal';
import BulkActionsBar from './components/BulkActionsBar';
import UserFilters from './components/UserFilters';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockUsers = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@mojsa.com",
      phone: "+34 600 123 456",
      role: "admin",
      branchId: "1",
      branch: "Sucursal Centro",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      permissions: {
        viewReports: true,
        manageMenu: true,
        processOrders: true,
        manageUsers: true,
        viewAnalytics: true,
        exportData: true
      }
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@mojsa.com",
      phone: "+34 600 234 567",
      role: "manager",
      branchId: "1",
      branch: "Sucursal Centro",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
      permissions: {
        viewReports: true,
        manageMenu: true,
        processOrders: true,
        manageUsers: false,
        viewAnalytics: true,
        exportData: true
      }
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@mojsa.com",
      phone: "+34 600 345 678",
      role: "cashier",
      branchId: "2",
      branch: "Sucursal Norte",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4),
      permissions: {
        viewReports: false,
        manageMenu: false,
        processOrders: true,
        manageUsers: false,
        viewAnalytics: false,
        exportData: false
      }
    },
    {
      id: 4,
      name: "Luis Fernández",
      email: "luis.fernandez@mojsa.com",
      phone: "+34 600 456 789",
      role: "kitchen",
      branchId: "1",
      branch: "Sucursal Centro",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6),
      permissions: {
        viewReports: false,
        manageMenu: false,
        processOrders: true,
        manageUsers: false,
        viewAnalytics: false,
        exportData: false
      }
    },
    {
      id: 5,
      name: "Isabel López",
      email: "isabel.lopez@mojsa.com",
      phone: "+34 600 567 890",
      role: "manager",
      branchId: "3",
      branch: "Sucursal Sur",
      status: "inactive",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      permissions: {
        viewReports: true,
        manageMenu: true,
        processOrders: true,
        manageUsers: false,
        viewAnalytics: true,
        exportData: true
      }
    },
    {
      id: 6,
      name: "Pedro Sánchez",
      email: "pedro.sanchez@mojsa.com",
      phone: "+34 600 678 901",
      role: "cashier",
      branchId: "2",
      branch: "Sucursal Norte",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 8),
      permissions: {
        viewReports: false,
        manageMenu: false,
        processOrders: true,
        manageUsers: false,
        viewAnalytics: false,
        exportData: false
      }
    }
  ];

  const mockBranches = [
    { id: "1", name: "Sucursal Centro", address: "Av. Principal 123" },
    { id: "2", name: "Sucursal Norte", address: "Calle Norte 456" },
    { id: "3", name: "Sucursal Sur", address: "Av. Sur 789" }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply branch filter
    if (branchFilter !== 'all') {
      filtered = filtered.filter(user => user.branchId === branchFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'lastLogin') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, branchFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setBranchFilter('all');
    setStatusFilter('all');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleViewActivity = (user) => {
    setSelectedUser(user);
    setShowActivityModal(true);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
  };

  const handleResetPassword = (user) => {
    // Mock password reset
    alert(`Contraseña restablecida para ${user.name}. Nueva contraseña enviada por email.`);
  };

  const handleSaveUser = (userData) => {
    if (userData.id && users.find(u => u.id === userData.id)) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === userData.id 
          ? { 
              ...userData, 
              branch: mockBranches.find(b => b.id === userData.branch)?.name || userData.branch 
            }
          : u
      ));
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id)) + 1,
        branch: mockBranches.find(b => b.id === userData.branch)?.name || userData.branch,
        lastLogin: null
      };
      setUsers([...users, newUser]);
    }
  };

  const handleBulkAction = (action) => {
    const selectedUserObjects = users.filter(u => selectedUsers.includes(u.id));
    
    switch (action) {
      case 'activate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ));
        break;
      case 'deactivate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
        ));
        break;
      case 'reset-password':
        alert(`Contraseñas restablecidas para ${selectedUsers.length} usuarios.`);
        break;
      case 'export':
        alert(`Exportando datos de ${selectedUsers.length} usuarios.`);
        break;
      case 'delete':
        if (confirm(`¿Está seguro de que desea eliminar ${selectedUsers.length} usuarios?`)) {
          setUsers(users.filter(u => !selectedUsers.includes(u.id)));
        }
        break;
    }
    setSelectedUsers([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-60 pt-16 pb-16 lg:pb-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando usuarios...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16 pb-16 lg:pb-0">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
              <p className="text-muted-foreground mt-2">
                Administra cuentas de usuario, roles y permisos del sistema
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  iconName="Table"
                  className="h-8 px-3"
                />
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  iconName="Grid3X3"
                  className="h-8 px-3"
                />
              </div>
              
              <Button
                onClick={handleAddUser}
                iconName="Plus"
                iconPosition="left"
              >
                Nuevo Usuario
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={24} className="text-success" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-accent" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conectados Hoy</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users.filter(u => {
                      if (!u.lastLogin) return false;
                      const today = new Date();
                      const loginDate = new Date(u.lastLogin);
                      return loginDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={24} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            branchFilter={branchFilter}
            onBranchFilterChange={setBranchFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
            branches={mockBranches}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedCount={selectedUsers.length}
            onBulkAction={handleBulkAction}
            onClearSelection={handleClearSelection}
          />

          {/* Users Display */}
          {filteredUsers.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center shadow-subtle">
              <Icon name="Users" size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron usuarios
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || roleFilter !== 'all' || branchFilter !== 'all' || statusFilter !== 'all' ?'Intenta ajustar los filtros de búsqueda.' :'Comienza agregando tu primer usuario al sistema.'}
              </p>
              {!(searchTerm || roleFilter !== 'all' || branchFilter !== 'all' || statusFilter !== 'all') && (
                <Button
                  onClick={handleAddUser}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Crear Primer Usuario
                </Button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <UserTable
              users={filteredUsers}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onEdit={handleEditUser}
              onViewActivity={handleViewActivity}
              onToggleStatus={handleToggleStatus}
              onResetPassword={handleResetPassword}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onViewActivity={handleViewActivity}
                  onToggleStatus={handleToggleStatus}
                  onResetPassword={handleResetPassword}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
        branches={mockBranches}
      />

      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;