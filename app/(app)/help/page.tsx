"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, Book, Video, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Ayuda() {
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const helpTopics = [
    {
      id: 1,
      title: 'Guía de Inicio Rápido',
      description: 'Aprende los conceptos básicos de MediStock en 5 minutos',
      icon: Book,
      color: 'emerald',
      type: 'Documentación',
    },
    {
      id: 2,
      title: 'Video Tutoriales',
      description: 'Tutoriales paso a paso en video para todas las funciones',
      icon: Video,
      color: 'blue',
      type: 'Video',
    },
    {
      id: 3,
      title: 'Preguntas Frecuentes',
      description: 'Respuestas a las dudas más comunes de los usuarios',
      icon: MessageCircle,
      color: 'purple',
      type: 'FAQ',
    },
    {
      id: 4,
      title: 'Gestión de Inventario',
      description: 'Cómo registrar, actualizar y dar de baja productos',
      icon: FileText,
      color: 'pink',
      type: 'Guía',
    },
    {
      id: 5,
      title: 'Alertas y Notificaciones',
      description: 'Configura alertas de stock y vencimientos',
      icon: FileText,
      color: 'yellow',
      type: 'Guía',
    },
    {
      id: 6,
      title: 'Reportes Personalizados',
      description: 'Crea y exporta reportes según tus necesidades',
      icon: FileText,
      color: 'cyan',
      type: 'Guía',
    },
  ];

  const faqs = [
    { q: '¿Cómo registro un nuevo producto?', a: 'Ve a Inventario > Nuevo Producto y completa el formulario.' },
    { q: '¿Cómo configuro alertas de stock bajo?', a: 'En Configuración > Notificaciones puedes activar las alertas.' },
    { q: '¿Puedo exportar los datos?', a: 'Sí, en Reportes puedes generar y descargar archivos PDF o Excel.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.1 + index * 0.08, ease: 'power2.out' }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
      pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
      cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Centro de Ayuda</h1>
        <p className="text-gray-500 dark:text-gray-400">Encuentra respuestas y aprende a usar MediStock eficientemente.</p>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-8 mb-6 text-white shadow-xl transition-all">
        <h2 className="text-white mb-4">¿En qué podemos ayudarte?</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-300" size={20} />
          <Input
            type="text"
            placeholder="Buscar en la documentación..."
            className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-emerald-200 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Help Topics */}
      <div className="mb-8">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">Temas Populares</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;
            const colors = getColorClasses(topic.color);
            
            return (
              <div
                key={topic.id}
                ref={(el) => {cardsRef.current[index] = el;}}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -4, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={colors.text} size={24} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{topic.type}</div>
                <h4 className="text-gray-900 dark:text-gray-100 mb-2">{topic.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{topic.description}</p>
                <button className={`${colors.text} hover:underline text-sm flex items-center gap-1 transition-colors`}>
                  Leer más <ExternalLink size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-gray-900 dark:text-gray-100 mb-4">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                ref={(el) => {cardsRef.current[helpTopics.length + index] = el;}}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <h4 className="text-gray-900 dark:text-gray-100 mb-2">{faq.q}</h4>
                <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 mb-4">¿Necesitas más ayuda?</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-4 transition-colors">
            <h4 className="text-gray-900 dark:text-gray-100 mb-2">Contacta Soporte</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Nuestro equipo está disponible 24/7</p>
            <button
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-lg hover:shadow-lg transition-all px-[11px] py-[10px]"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              Abrir Chat
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h4 className="text-gray-900 dark:text-gray-100 mb-2">Recursos</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                API Documentation →
              </a>
              <a href="#" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Release Notes →
              </a>
              <a href="#" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Community Forum →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
