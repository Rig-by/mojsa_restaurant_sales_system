import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadge = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
        {/* SSL Security */}
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span>SSL Seguro</span>
        </div>

        {/* Data Protection */}
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={14} className="text-success" />
          <span>Datos Protegidos</span>
        </div>

        {/* 24/7 Support */}
        <div className="flex items-center space-x-1">
          <Icon name="Headphones" size={14} className="text-primary" />
          <span>Soporte 24/7</span>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Mojsa v2.1.0 • © {new Date().getFullYear()} Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default SecurityBadge;