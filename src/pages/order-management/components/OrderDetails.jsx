import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OrderDetails = ({ order, onUpdateOrder, onPrintReceipt }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');

  if (!order) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="ShoppingCart" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Selecciona un Pedido</h3>
          <p className="text-muted-foreground">Elige un pedido de la cola para ver los detalles</p>
        </div>
      </div>
    );
  }

  const handleQuantityEdit = (itemId, currentQuantity) => {
    setEditingItem(itemId);
    setEditQuantity(currentQuantity.toString());
  };

  const handleQuantityUpdate = (itemId) => {
    const newQuantity = parseInt(editQuantity);
    if (newQuantity > 0) {
      onUpdateOrder(order.id, 'updateQuantity', { itemId, quantity: newQuantity });
    }
    setEditingItem(null);
    setEditQuantity('');
  };

  const handleRemoveItem = (itemId) => {
    onUpdateOrder(order.id, 'removeItem', { itemId });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'preparing':
        return 'text-primary';
      case 'ready':
        return 'text-success';
      case 'completed':
        return 'text-muted-foreground';
      default:
        return 'text-secondary';
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.21; // 21% IVA
  const total = subtotal + tax;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Pedido #{order.orderNumber}</h2>
            <p className="text-sm text-muted-foreground">Creado el {formatTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${getStatusColor(order.status)}`}>
              {order.status === 'pending' && 'Pendiente'}
              {order.status === 'preparing' && 'Preparando'}
              {order.status === 'ready' && 'Listo'}
              {order.status === 'completed' && 'Completado'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrintReceipt(order.id)}
              iconName="Printer"
              iconPosition="left"
            >
              Imprimir
            </Button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <h4 className="font-medium text-foreground mb-2">Información del Cliente</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={14} />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={14} />
                <span>{order.customerPhone}</span>
              </div>
              {order.customerEmail && (
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} />
                  <span>{order.customerEmail}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Detalles del Pedido</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name={order.orderType === 'delivery' ? 'Truck' : 'Package'} size={14} />
                <span>{order.orderType === 'delivery' ? 'Entrega a domicilio' : 'Recogida en tienda'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CreditCard" size={14} />
                <span>{order.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.paymentStatus === 'paid' ?'bg-success text-success-foreground' :'bg-warning text-warning-foreground'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
              {order.priority === 'high' && (
                <div className="flex items-center space-x-2 text-error">
                  <Icon name="AlertTriangle" size={14} />
                  <span>Prioridad Alta</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="font-medium text-foreground mb-4">Artículos del Pedido</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item.name}</h4>
                {item.modifications && item.modifications.length > 0 && (
                  <div className="mt-1">
                    {item.modifications.map((mod, index) => (
                      <span key={index} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded mr-2">
                        {mod}
                      </span>
                    ))}
                  </div>
                )}
                {item.specialInstructions && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    Nota: {item.specialInstructions}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium text-foreground">€{item.price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">por unidad</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editingItem === item.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityUpdate(item.id)}
                        iconName="Check"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(null)}
                        iconName="X"
                      />
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityEdit(item.id, item.quantity)}
                        className="px-3 py-1 font-medium"
                      >
                        {item.quantity}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        iconName="Trash2"
                        className="text-error hover:text-error"
                      />
                    </>
                  )}
                </div>
                
                <div className="text-right min-w-20">
                  <div className="font-semibold text-foreground">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Instrucciones Especiales
            </h4>
            <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-6 p-4 bg-card border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Resumen del Pedido</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA (21%)</span>
              <span className="text-foreground">€{tax.toFixed(2)}</span>
            </div>
            {order.deliveryFee && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gastos de envío</span>
                <span className="text-foreground">€{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;