import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import OrderQueue from './components/OrderQueue';
import OrderDetails from './components/OrderDetails';
import OrderActions from './components/OrderActions';
import OrderFilters from './components/OrderFilters';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userRole] = useState('admin'); // Mock user role

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-2025-001',
        customerName: 'María García',
        customerPhone: '+34 666 123 456',
        customerEmail: 'maria.garcia@email.com',
        status: 'pending',
        orderType: 'delivery',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        priority: 'normal',
        total: 24.50,
        deliveryFee: 2.50,
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        items: [
          {
            id: 1,
            name: 'Paella Valenciana',
            price: 18.00,
            quantity: 1,
            modifications: ['Sin mariscos'],
            specialInstructions: 'Poco hecha por favor'
          },
          {
            id: 2,
            name: 'Sangría (1L)',
            price: 8.00,
            quantity: 1,
            modifications: []
          }
        ],
        specialInstructions: 'Llamar al llegar, portero automático no funciona'
      },
      {
        id: 2,
        orderNumber: 'ORD-2025-002',
        customerName: 'Carlos Rodríguez',
        customerPhone: '+34 677 987 654',
        status: 'preparing',
        orderType: 'pickup',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        priority: 'high',
        total: 32.75,
        createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        preparingAt: new Date(Date.now() - 20 * 60 * 1000),
        items: [
          {
            id: 3,
            name: 'Jamón Ibérico (100g)',
            price: 15.00,
            quantity: 1,
            modifications: []
          },
          {
            id: 4,
            name: 'Tortilla Española',
            price: 8.50,
            quantity: 2,
            modifications: ['Extra cebolla']
          },
          {
            id: 5,
            name: 'Pan con Tomate',
            price: 4.75,
            quantity: 2,
            modifications: []
          }
        ]
      },
      {
        id: 3,
        orderNumber: 'ORD-2025-003',
        customerName: 'Ana Martínez',
        customerPhone: '+34 655 444 333',
        customerEmail: 'ana.martinez@email.com',
        status: 'ready',
        orderType: 'delivery',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        priority: 'normal',
        total: 19.25,
        deliveryFee: 2.50,
        createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        preparingAt: new Date(Date.now() - 35 * 60 * 1000),
        readyAt: new Date(Date.now() - 5 * 60 * 1000),
        items: [
          {
            id: 6,
            name: 'Gazpacho Andaluz',
            price: 6.50,
            quantity: 1,
            modifications: []
          },
          {
            id: 7,
            name: 'Croquetas de Jamón',
            price: 9.25,
            quantity: 1,
            modifications: []
          }
        ]
      },
      {
        id: 4,
        orderNumber: 'ORD-2025-004',
        customerName: 'David López',
        customerPhone: '+34 688 555 777',
        status: 'completed',
        orderType: 'pickup',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        priority: 'normal',
        total: 15.80,
        createdAt: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
        preparingAt: new Date(Date.now() - 80 * 60 * 1000),
        readyAt: new Date(Date.now() - 70 * 60 * 1000),
        completedAt: new Date(Date.now() - 65 * 60 * 1000),
        items: [
          {
            id: 8,
            name: 'Bocadillo de Calamares',
            price: 7.50,
            quantity: 1,
            modifications: ['Sin mayonesa']
          },
          {
            id: 9,
            name: 'Cerveza Estrella (33cl)',
            price: 2.80,
            quantity: 2,
            modifications: []
          },
          {
            id: 10,
            name: 'Patatas Bravas',
            price: 5.50,
            quantity: 1,
            modifications: ['Salsa aparte']
          }
        ]
      },
      {
        id: 5,
        orderNumber: 'ORD-2025-005',
        customerName: 'Laura Fernández',
        customerPhone: '+34 699 111 222',
        status: 'pending',
        orderType: 'delivery',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        priority: 'normal',
        total: 28.90,
        deliveryFee: 2.50,
        createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
        items: [
          {
            id: 11,
            name: 'Pulpo a la Gallega',
            price: 16.50,
            quantity: 1,
            modifications: []
          },
          {
            id: 12,
            name: 'Empanada Gallega',
            price: 9.90,
            quantity: 1,
            modifications: []
          }
        ],
        specialInstructions: 'Entregar en la puerta trasera del edificio'
      }
    ];

    setOrders(mockOrders);
    if (mockOrders.length > 0) {
      setSelectedOrderId(mockOrders[0].id);
    }
  }, []);

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          const now = new Date();
          
          switch (newStatus) {
            case 'preparing':
              updatedOrder.preparingAt = now;
              break;
            case 'ready':
              updatedOrder.readyAt = now;
              break;
            case 'completed':
              updatedOrder.completedAt = now;
              break;
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const handleUpdateOrder = (orderId, action, data) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order };
          
          switch (action) {
            case 'updateQuantity':
              updatedOrder.items = order.items.map(item =>
                item.id === data.itemId
                  ? { ...item, quantity: data.quantity }
                  : item
              );
              // Recalculate total
              const subtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const tax = subtotal * 0.21;
              updatedOrder.total = subtotal + tax + (updatedOrder.deliveryFee || 0);
              break;
            case 'removeItem':
              updatedOrder.items = order.items.filter(item => item.id !== data.itemId);
              // Recalculate total
              const newSubtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const newTax = newSubtotal * 0.21;
              updatedOrder.total = newSubtotal + newTax + (updatedOrder.deliveryFee || 0);
              break;
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const handlePrintReceipt = (orderId) => {
    console.log('Printing receipt for order:', orderId);
    // Mock print functionality
    alert('Recibo enviado a la impresora');
  };

  const handleNotifyCustomer = (orderId) => {
    console.log('Notifying customer for order:', orderId);
    // Mock notification functionality
    alert('Cliente notificado por SMS');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Mock refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-60">
          <div className="h-[calc(100vh-4rem)]">
            {/* Filters */}
            <OrderFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              orderTypeFilter={orderTypeFilter}
              onOrderTypeFilterChange={setOrderTypeFilter}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Three Column Layout */}
            <div className="flex h-[calc(100%-140px)]">
              {/* Left Panel - Order Queue */}
              <div className="w-full lg:w-80 xl:w-96 border-r border-border bg-card">
                <OrderQueue
                  orders={orders}
                  selectedOrderId={selectedOrderId}
                  onOrderSelect={handleOrderSelect}
                  onStatusUpdate={handleStatusUpdate}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                />
              </div>

              {/* Middle Panel - Order Details */}
              <div className="hidden lg:block flex-1 bg-background">
                <OrderDetails
                  order={selectedOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onPrintReceipt={handlePrintReceipt}
                />
              </div>

              {/* Right Panel - Order Actions */}
              <div className="hidden xl:block w-80 border-l border-border bg-card">
                <OrderActions
                  order={selectedOrder}
                  onStatusUpdate={handleStatusUpdate}
                  onNotifyCustomer={handleNotifyCustomer}
                  onPrintReceipt={handlePrintReceipt}
                  userRole={userRole}
                />
              </div>
            </div>

            {/* Mobile Order Details Modal */}
            {selectedOrder && (
              <div className="lg:hidden fixed inset-0 bg-background z-50 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <OrderDetails
                      order={selectedOrder}
                      onUpdateOrder={handleUpdateOrder}
                      onPrintReceipt={handlePrintReceipt}
                    />
                  </div>
                  <div className="border-t border-border bg-card p-4">
                    <OrderActions
                      order={selectedOrder}
                      onStatusUpdate={handleStatusUpdate}
                      onNotifyCustomer={handleNotifyCustomer}
                      onPrintReceipt={handlePrintReceipt}
                      userRole={userRole}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderManagement;