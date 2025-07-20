import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LanguageToggle = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('mojsa_language') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('mojsa_language', languageCode);
    setShowDropdown(false);
    
    // In a real app, this would trigger a language change event
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { language: languageCode } 
    }));
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="min-w-32"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCurrentLanguage().flag}</span>
          <span className="text-sm font-medium">{getCurrentLanguage().name}</span>
          <Icon name="ChevronDown" size={16} />
        </div>
      </Button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-pronounced z-200 animate-slide-in">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
              Seleccionar Idioma
            </div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center space-x-3 ${
                  language.code === currentLanguage
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-popover-foreground'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {language.code === currentLanguage && (
                  <Icon name="Check" size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;