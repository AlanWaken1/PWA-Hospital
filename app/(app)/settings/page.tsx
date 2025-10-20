"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Bell, Lock, Globe, Palette, Database, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';

export default function Configuracion() {
  const titleRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });

      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.from(section, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: 0.1 + index * 0.1,
            ease: 'power2.out',
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Configuración del Sistema</h1>
        <p className="text-gray-500 dark:text-gray-400">Personaliza y ajusta las preferencias de MediStock.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Notifications */}
          <div
            ref={(el) => {sectionsRef.current[0] = el;}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Bell className="text-emerald-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Notificaciones</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configura las alertas del sistema</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h4 className="text-sm text-gray-900 dark:text-gray-100">Alertas de stock bajo</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notificar cuando el inventario esté bajo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h4 className="text-sm text-gray-900 dark:text-gray-100">Alertas de vencimiento</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avisar sobre productos próximos a vencer</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h4 className="text-sm text-gray-900 dark:text-gray-100">Notificaciones por email</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recibir resúmenes diarios por correo</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm text-gray-900 dark:text-gray-100">Notificaciones push</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alertas en tiempo real en el navegador</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Security */}
          <div
            ref={(el) => {sectionsRef.current[1] = el;}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Seguridad</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona el acceso y contraseñas</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Contraseña actual</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nueva contraseña</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirmar contraseña</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <button
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-lg hover:shadow-lg transition-all mt-2 px-[11px] py-[10px]"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
              >
                Actualizar Contraseña
              </button>
            </div>
          </div>

          {/* System */}
          <div
            ref={(el) => {sectionsRef.current[2] = el;}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Sistema</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configuraciones generales</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nombre del hospital</label>
                <Input placeholder="Hospital General Central" defaultValue="Hospital General Central" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Moneda</label>
                <Select defaultValue="mxn">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mxn">MXN - Peso Mexicano</SelectItem>
                    <SelectItem value="usd">USD - Dólar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Zona horaria</label>
                <Select defaultValue="cdmx">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdmx">Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="monterrey">Monterrey (GMT-6)</SelectItem>
                    <SelectItem value="tijuana">Tijuana (GMT-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Settings */}
        <div className="space-y-6">
          {/* Appearance */}
          <div
            ref={(el) => {sectionsRef.current[3] = el;}}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Palette className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white">Apariencia</h3>
                <p className="text-sm text-emerald-100">Personaliza el tema</p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setTheme('light')}
                className={`w-full ${theme === 'light' ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/30 text-white py-2.5 rounded-lg transition-all flex items-center justify-center gap-2`}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
              >
                <span>☀️</span>
                <span>Modo claro</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`w-full ${theme === 'dark' ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/30 text-white py-2.5 rounded-lg transition-all flex items-center justify-center gap-2`}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
              >
                <span>🌙</span>
                <span>Modo oscuro</span>
              </button>
              <button 
                onClick={() => setTheme('auto')}
                className={`w-full ${theme === 'auto' ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/30 text-white py-2.5 rounded-lg transition-all flex items-center justify-center gap-2`}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
              >
                <span>🔄</span>
                <span>Automático</span>
              </button>
            </div>
          </div>

          {/* Language */}
          <div
            ref={(el) => {sectionsRef.current[4] = el;}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Idioma</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona el idioma</p>
              </div>
            </div>

            <Select defaultValue="es">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy */}
          <div
            ref={(el) => {sectionsRef.current[5] = el;}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Shield className="text-yellow-600" size={20} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Privacidad</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Controla tus datos</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 py-2 transition-colors">
                Exportar datos →
              </button>
              <button className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 py-2 transition-colors">
                Política de privacidad →
              </button>
              <button className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2 transition-colors">
                Eliminar cuenta →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
