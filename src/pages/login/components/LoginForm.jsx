import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import authService from '../../../utils/authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, authError, clearError, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // Load branches on component mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const result = await authService.getBranches();
        if (result?.success) {
          const branchOptions = result.data.map(branch => ({
            value: branch.id,
            label: `${branch.name} (${branch.code})`,
            description: branch.address
          }));
          setBranches(branchOptions);
        }
      } catch (error) {
        console.log('Failed to load branches:', error);
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, []);

  // Clear auth error when form data changes
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [formData.email, formData.password]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result?.success) {
        // Store remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('mojsa_remember_me', 'true');
        } else {
          localStorage.removeItem('mojsa_remember_me');
        }

        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Ingrese su correo electrónico para recuperar la contraseña' });
      return;
    }

    // TODO: Implement password reset functionality
    alert('Se ha enviado un enlace de recuperación a su correo electrónico (funcionalidad próximamente disponible)');
  };

  const isFormLoading = isLoading || authLoading;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Auth Error */}
        {authError && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{authError}</p>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {Object.values(errors).map((error, index) => (
                  <p key={index} className="text-sm text-error">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="usuario@mojsa.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          disabled={isFormLoading}
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingrese su contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
            disabled={isFormLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
            disabled={isFormLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Remember Me */}
        <Checkbox
          label="Recordar mi sesión"
          description="Mantener sesión activa en este dispositivo"
          checked={formData.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
          disabled={isFormLoading}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isFormLoading}
          iconName="LogIn"
          iconPosition="left"
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Forgot Password */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            disabled={isFormLoading}
          >
            ¿Olvidó su contraseña?
          </button>
        </div>
      </form>

      {/* Test Credentials Info */}
      <div className="mt-8 bg-muted/20 border border-border/50 rounded-lg p-4">
        <div className="text-center">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Credenciales de Prueba
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-card/50 rounded p-2">
              <p className="font-medium text-foreground">Administrador</p>
              <p className="text-muted-foreground">admin@mojsa.com</p>
              <p className="text-muted-foreground">admin123</p>
            </div>
            <div className="bg-card/50 rounded p-2">
              <p className="font-medium text-foreground">Gerente</p>
              <p className="text-muted-foreground">manager@mojsa.com</p>
              <p className="text-muted-foreground">manager123</p>
            </div>
            <div className="bg-card/50 rounded p-2">
              <p className="font-medium text-foreground">Cajero</p>
              <p className="text-muted-foreground">cajero@mojsa.com</p>
              <p className="text-muted-foreground">cajero123</p>
            </div>
            <div className="bg-card/50 rounded p-2">
              <p className="font-medium text-foreground">Cocina</p>
              <p className="text-muted-foreground">cocina@mojsa.com</p>
              <p className="text-muted-foreground">cocina123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;