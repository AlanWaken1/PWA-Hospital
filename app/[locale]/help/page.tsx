// app/(app)/ayuda/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    Search,
    Book,
    MessageCircle,
    FileText,
    Download,
    FileDown,
    Globe,
    HelpCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Ayuda() {
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Manuales disponibles
    const manuales = [
        {
            id: 1,
            title: 'Manual de Usuario',
            description: 'Guía completa del sistema MediStock en español',
            language: 'Español',
            icon: Book,
            color: 'emerald',
            filename: 'manual-medistock-es.pdf',
            size: '170 KB',
        },
        {
            id: 2,
            title: 'User Manual',
            description: 'Complete MediStock system guide in English',
            language: 'English',
            icon: Globe,
            color: 'blue',
            filename: 'manual-medistock-en.pdf',
            size: '175 KB',
        },
    ];

    // Preguntas frecuentes
    const faqs = [
        {
            q: '¿Cómo registro un nuevo producto?',
            a: 'Ve a Inventario, haz clic en "Agregar Producto" y completa el formulario con los datos del producto.'
        },
        {
            q: '¿Cómo configuro alertas de stock bajo?',
            a: 'Al crear o editar un producto, puedes establecer el "Stock Mínimo". Cuando el inventario llegue a ese nivel, recibirás una alerta.'
        },
        {
            q: '¿Puedo exportar los datos?',
            a: 'Sí, en la sección de Reportes puedes generar y descargar informes en formato PDF.'
        },
        {
            q: '¿Cómo registro una entrada de inventario?',
            a: 'En Inventario, busca el producto y usa el botón "Agregar Stock" para registrar nuevas unidades.'
        },
        {
            q: '¿Qué hago si un producto está por caducar?',
            a: 'El sistema te notificará automáticamente. Puedes ver todos los productos próximos a caducar en el Dashboard o en Alertas.'
        },
        {
            q: '¿Cómo cambio mi contraseña?',
            a: 'Ve a Configuración > Cuenta y selecciona "Cambiar contraseña".'
        },
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
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            emerald: {
                bg: 'bg-theme-primary/20 dark:bg-theme-primary-dark/30',
                text: 'text-theme-primary dark:text-theme-primary-light',
                border: 'border-theme-primary/30 dark:border-theme-primary-dark/50'
            },
            blue: {
                bg: 'bg-blue-100 dark:bg-blue-900/30',
                text: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-800/50'
            },
        };
        return colors[color] || colors.emerald;
    };

    // Función para descargar manual
    const handleDownload = (filename: string) => {
        // Los archivos están en public/manuales/
        const link = document.createElement('a');
        link.href = `/manuales/${filename}`;
        link.download = filename;
        link.click();
    };

    return (
        <>
            {/* Page Title */}
            <div ref={titleRef} className="mb-6">
                <h1 className="text-gray-900 dark:text-gray-100 mb-2">Centro de Ayuda</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Descarga los manuales y encuentra respuestas a tus preguntas.
                </p>
            </div>

            {/* Search */}
            <div className="bg-gradient-to-br from-theme-primary to-theme-primary-dark dark:from-theme-primary-dark dark:to-theme-primary-dark rounded-2xl p-8 mb-6 text-white shadow-xl transition-all">
                <h2 className="text-white mb-4">¿En qué podemos ayudarte?</h2>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-primary-light" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar en la documentación..."
                        className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-theme-primary-light backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Manuales de Usuario */}
            <div className="mb-8">
                <h3 className="text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FileDown size={20} />
                    Manuales de Usuario
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {manuales.map((manual, index) => {
                        const Icon = manual.icon;
                        const colors = getColorClasses(manual.color);

                        return (
                            <div
                                key={manual.id}
                                ref={(el) => { cardsRef.current[index] = el; }}
                                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${colors.border} hover:shadow-lg transition-all`}
                                onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -4, duration: 0.2 })}
                                onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={colors.text} size={28} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {manual.title}
                                            </h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {manual.language}
                      </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                            {manual.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        PDF • {manual.size}
                      </span>
                                            <button
                                                onClick={() => handleDownload(manual.filename)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg} ${colors.text} hover:opacity-80 transition-all font-medium text-sm`}
                                                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
                                                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                                            >
                                                <Download size={16} />
                                                Descargar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <HelpCircle size={20} />
                        Preguntas Frecuentes
                    </h3>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                ref={(el) => { cardsRef.current[manuales.length + index] = el; }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors hover:border-theme-primary/30 dark:hover:border-theme-primary-dark/50"
                            >
                                <h4 className="text-gray-900 dark:text-gray-100 mb-2 font-medium flex items-start gap-2">
                                    <MessageCircle size={18} className="text-theme-primary mt-0.5 flex-shrink-0" />
                                    {faq.q}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 ml-6">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <h3 className="text-gray-900 dark:text-gray-100 mb-4">Información</h3>

                    {/* Versión del sistema */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-4 transition-colors">
                        <h4 className="text-gray-900 dark:text-gray-100 mb-3">Acerca de MediStock</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Versión</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Última actualización</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">Nov 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                        <h4 className="text-gray-900 dark:text-gray-100 mb-2">¿Necesitas más ayuda?</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Si no encuentras la respuesta que buscas, consulta los manuales de usuario.
                        </p>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>
                                <br />
                                overwatch@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}