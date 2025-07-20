import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MenuItemCard = ({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleAvailability, 
  onQuickPriceEdit 
}) => {
  const [isQuickEditMode, setIsQuickEditMode] = useState(false);
  const [quickPrice, setQuickPrice] = useState(item.price);

  const handleQuickPriceSubmit = () => {
    onQuickPriceEdit(item.id, quickPrice);
    setIsQuickEditMode(false);
  };

  const handleQuickPriceCancel = () => {
    setQuickPrice(item.price);
    setIsQuickEditMode(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle hover:shadow-moderate transition-all duration-200 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.available 
              ? 'bg-success text-success-foreground' 
              : 'bg-destructive text-destructive-foreground'
          }`}>
            {item.available ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-1">
            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8 bg-card/90 backdrop-blur-sm"
              onClick={() => onEdit(item)}
            >
              <Icon name="Edit2" size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8 bg-card/90 backdrop-blur-sm"
              onClick={() => onDelete(item)}
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>

        {/* Stock Status */}
        {item.stock !== undefined && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.stock > 10 
                ? 'bg-success/20 text-success border border-success/30' 
                : item.stock > 0
                ? 'bg-warning/20 text-warning border border-warning/30' :'bg-destructive/20 text-destructive border border-destructive/30'
            }`}>
              Stock: {item.stock}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-foreground line-clamp-1">
            {item.name}
          </h4>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => onToggleAvailability(item.id, !item.available)}
            >
              <Icon 
                name={item.available ? "Eye" : "EyeOff"} 
                size={16}
                className={item.available ? "text-success" : "text-muted-foreground"}
              />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          {isQuickEditMode ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={quickPrice}
                onChange={(e) => setQuickPrice(parseFloat(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickPriceSubmit}
              >
                <Icon name="Check" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuickPriceCancel}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                €{item.price.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsQuickEditMode(true)}
              >
                <Icon name="Edit2" size={12} />
              </Button>
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <Icon name="AlertTriangle" size={14} className="text-warning" />
            <span className="text-xs text-muted-foreground">
              Alérgenos: {item.allergens.join(', ')}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>ID: {item.id}</span>
          <span>Actualizado: {item.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;