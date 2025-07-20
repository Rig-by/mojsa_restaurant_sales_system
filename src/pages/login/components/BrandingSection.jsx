import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandingSection = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-moderate">
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="UtensilsCrossed" size={14} className="text-accent-foreground" />
          </div>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Mojsa - Puno
      </h1>
      
      {/* Tagline */}
      <p className="text-lg text-muted-foreground mb-1">
        Sistema de Ventas
      </p>
      
      {/* Subtitle */}
      <p className="text-sm text-muted-foreground">
        Gestión Integral de Restaurantes Mojsa Sucursales
      </p>

      {/* Decorative Elements */}
      <div className="flex justify-center items-center space-x-2 mt-6 mb-8">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary/30"></div>
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary/30"></div>
      </div>

      {/* Welcome Message */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Bienvenido al sistema de gestión Mojsa Puno
        </p>
      </div>
    </div>
  );
};

export default BrandingSection;