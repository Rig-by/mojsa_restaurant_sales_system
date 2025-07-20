import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTree = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onCategoryAdd, 
  onCategoryEdit, 
  onCategoryDelete,
  onCategoryReorder 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['1', '2', '3']));
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragStart = (e, category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== targetCategory.id) {
      onCategoryReorder(draggedItem, targetCategory);
    }
    setDraggedItem(null);
  };

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;

    return (
      <div key={category.id} className="select-none">
        <div
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected 
              ? 'bg-primary text-primary-foreground shadow-subtle' 
              : 'hover:bg-muted'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onCategorySelect(category)}
          draggable
          onDragStart={(e) => handleDragStart(e, category)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, category)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 mr-1 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(category.id);
              }}
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={14} 
              />
            </Button>
          )}
          
          <div className="flex items-center flex-1 min-w-0">
            <Icon 
              name={category.icon || "Folder"} 
              size={16} 
              className="mr-2 flex-shrink-0" 
            />
            <span className="text-sm font-medium truncate">{category.name}</span>
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              ({category.itemCount || 0})
            </span>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryEdit(category);
              }}
            >
              <Icon name="Edit2" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryDelete(category);
              }}
            >
              <Icon name="Trash2" size={12} />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.subcategories.map(subcategory => 
              renderCategory(subcategory, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Categorías</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            onClick={() => onCategoryAdd()}
          >
            Nueva
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={14} />
          <span>Arrastra para reordenar</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 group">
          {categories.map(category => renderCategory(category))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Total: {categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0)} productos
        </div>
      </div>
    </div>
  );
};

export default CategoryTree;