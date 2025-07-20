import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CategoryTree from './components/CategoryTree';
import MenuItemCard from './components/MenuItemCard';
import MenuToolbar from './components/MenuToolbar';
import MenuItemModal from './components/MenuItemModal';
import CategoryModal from './components/CategoryModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock data initialization
  useEffect(() => {
    const mockCategories = [
      {
        id: '1',
        name: 'Platos Principales',
        icon: 'UtensilsCrossed',
        itemCount: 12,
        sortOrder: 1,
        subcategories: [
          {
            id: '1-1',
            name: 'Carnes',
            icon: 'Beef',
            itemCount: 6,
            parentId: '1',
            sortOrder: 1
          },
          {
            id: '1-2',
            name: 'Pescados',
            icon: 'Fish',
            itemCount: 6,
            parentId: '1',
            sortOrder: 2
          }
        ]
      },
      {
        id: '2',
        name: 'Bebidas',
        icon: 'Coffee',
        itemCount: 8,
        sortOrder: 2,
        subcategories: [
          {
            id: '2-1',
            name: 'Calientes',
            icon: 'Coffee',
            itemCount: 4,
            parentId: '2',
            sortOrder: 1
          },
          {
            id: '2-2',
            name: 'Frías',
            icon: 'Wine',
            itemCount: 4,
            parentId: '2',
            sortOrder: 2
          }
        ]
      },
      {
        id: '3',
        name: 'Postres',
        icon: 'Cookie',
        itemCount: 5,
        sortOrder: 3,
        subcategories: []
      }
    ];

    const mockMenuItems = [
      {
        id: '1',
        name: 'Paella Valenciana',
        description: 'Auténtica paella valenciana con pollo, conejo, judías verdes, garrofón, tomate, pimiento, azafrán y aceite de oliva.',
        price: 18.50,
        categoryId: '1',
        image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop',
        available: true,
        stock: 15,
        tags: ['popular', 'traditional'],
        allergens: ['gluten'],
        branches: ['centro', 'norte'],
        lastUpdated: '20/07/2025'
      },
      {
        id: '2',
        name: 'Salmón a la Plancha',
        description: 'Filete de salmón fresco a la plancha con verduras de temporada y salsa de limón.',
        price: 22.00,
        categoryId: '1-2',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        available: true,
        stock: 8,
        tags: ['healthy', 'fish'],
        allergens: ['fish'],
        branches: ['centro', 'sur'],
        lastUpdated: '19/07/2025'
      },
      {
        id: '3',
        name: 'Entrecot de Ternera',
        description: 'Jugoso entrecot de ternera a la parrilla con patatas asadas y pimientos del piquillo.',
        price: 26.00,
        categoryId: '1-1',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        available: false,
        stock: 0,
        tags: ['premium', 'meat'],
        allergens: [],
        branches: ['norte', 'sur'],
        lastUpdated: '18/07/2025'
      },
      {
        id: '4',
        name: 'Café Cortado',
        description: 'Café espresso con un toque de leche caliente, servido en taza de cristal.',
        price: 2.50,
        categoryId: '2-1',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
        available: true,
        stock: 50,
        tags: ['coffee', 'hot'],
        allergens: ['lactose'],
        branches: ['centro', 'norte', 'sur'],
        lastUpdated: '20/07/2025'
      },
      {
        id: '5',
        name: 'Sangría de la Casa',
        description: 'Refrescante sangría con vino tinto, frutas de temporada y un toque de brandy.',
        price: 4.50,
        categoryId: '2-2',
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
        available: true,
        stock: 25,
        tags: ['alcoholic', 'cold', 'popular'],
        allergens: [],
        branches: ['centro', 'norte', 'sur'],
        lastUpdated: '20/07/2025'
      },
      {
        id: '6',
        name: 'Tarta de Santiago',
        description: 'Tradicional tarta gallega de almendra con azúcar glas y la cruz de Santiago.',
        price: 6.50,
        categoryId: '3',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        available: true,
        stock: 12,
        tags: ['dessert', 'traditional'],
        allergens: ['nuts', 'eggs'],
        branches: ['centro', 'sur'],
        lastUpdated: '19/07/2025'
      }
    ];

    setCategories(mockCategories);
    setMenuItems(mockMenuItems);
    setSelectedCategory(mockCategories[0]);
  }, []);

  // Filter items based on selected category, search query, and branch
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = !selectedCategory || 
      item.categoryId === selectedCategory.id || 
      (selectedCategory.subcategories && 
       selectedCategory.subcategories.some(sub => item.categoryId === sub.id));
    
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = selectedBranch === 'all' || 
      item.branches.includes(selectedBranch);

    return matchesCategory && matchesSearch && matchesBranch;
  });

  // Event handlers
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedItems([]);
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.name}"?`)) {
      setMenuItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleToggleAvailability = (itemId, available) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available } : item
    ));
  };

  const handleQuickPriceEdit = (itemId, newPrice) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { 
        ...item, 
        price: newPrice,
        lastUpdated: new Date().toLocaleDateString('es-ES')
      } : item
    ));
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? itemData : item
      ));
    } else {
      setMenuItems(prev => [...prev, itemData]);
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== category.id));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? categoryData : cat
      ));
    } else {
      setCategories(prev => [...prev, categoryData]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleCategoryReorder = (draggedCategory, targetCategory) => {
    // Simple reorder logic - in real app would be more sophisticated
    console.log('Reordering:', draggedCategory.name, 'to', targetCategory.name);
  };

  const handleBulkAction = (action, items) => {
    switch (action) {
      case 'enable':
        setMenuItems(prev => prev.map(item => 
          items.includes(item.id) ? { ...item, available: true } : item
        ));
        break;
      case 'disable':
        setMenuItems(prev => prev.map(item => 
          items.includes(item.id) ? { ...item, available: false } : item
        ));
        break;
      case 'delete':
        if (window.confirm(`¿Eliminar ${items.length} productos seleccionados?`)) {
          setMenuItems(prev => prev.filter(item => !items.includes(item.id)));
        }
        break;
      default:
        console.log('Bulk action:', action, items);
    }
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16 pb-20 lg:pb-6">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestión de Menú</h1>
                <p className="text-muted-foreground mt-1">
                  Administra categorías y productos del menú digital
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName={viewMode === 'grid' ? 'List' : 'Grid3X3'}
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? 'Lista' : 'Cuadrícula'}
                </Button>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <MenuToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            onAddNewItem={handleAddNewItem}
            onBulkAction={handleBulkAction}
            selectedItems={selectedItems}
            totalItems={menuItems.length}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Tree - Left Panel */}
            <div className="lg:col-span-4 xl:col-span-3">
              <CategoryTree
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onCategoryAdd={handleAddCategory}
                onCategoryEdit={handleEditCategory}
                onCategoryDelete={handleDeleteCategory}
                onCategoryReorder={handleCategoryReorder}
              />
            </div>

            {/* Menu Items - Right Panel */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-card border border-border rounded-lg">
                {/* Items Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedCategory ? selectedCategory.name : 'Todos los Productos'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredItems.length} productos encontrados
                      </p>
                    </div>
                    
                    {selectedCategory && (
                      <div className="flex items-center space-x-2">
                        <Icon name={selectedCategory.icon} size={20} className="text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {selectedCategory.itemCount} productos
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Grid/List */}
                <div className="p-4">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No hay productos
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? 'No se encontraron productos que coincidan con tu búsqueda' :'Comienza agregando productos a esta categoría'
                        }
                      </p>
                      <Button
                        variant="default"
                        onClick={handleAddNewItem}
                        iconName="Plus"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Agregar Primer Producto
                      </Button>
                    </div>
                  ) : (
                    <div className={
                      viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'
                    }>
                      {filteredItems.map(item => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onEdit={handleEditItem}
                          onDelete={handleDeleteItem}
                          onToggleAvailability={handleToggleAvailability}
                          onQuickPriceEdit={handleQuickPriceEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <MenuItemModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
        categories={categories}
        onSave={handleSaveItem}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        categories={categories}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default MenuManagement;