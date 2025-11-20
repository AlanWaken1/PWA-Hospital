"use client";

import { useEffect, useRef } from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import gsap from "gsap";
import {
    Activity, ArrowRight, BarChart, BarChart3, Bell, Check, CheckCircle2, ChevronDown, HelpCircle, Package, Quote, Shield, Smartphone, Star, TrendingUp, Users, Workflow, XCircle, Zap
} from "lucide-react";
import { MinimalHero } from "@/components/shared/MinimalHero";
import { useTheme } from "@/contexts/ThemeContext";

export default function LandingPage() {
    const params = useParams();
    const locale = params?.locale as string || 'es';
    // @ts-ignore
    const { isDark } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
                gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
                gsap.from(".hero-buttons", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
                gsap.from(".stat-item", { scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.8, ease: "back.out(1.7)" });
                gsap.from(".feature-card", { y: 40, duration: 0.6, stagger: 0.08, ease: "power2.out" });
            });
            return () => ctx.revert();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        { icon: Package, title: "Gestión de Inventario", description: "Control total de medicamentos, equipos e insumos médicos en tiempo real.", color: "from-blue-500 to-blue-600" },
        { icon: TrendingUp, title: "Analíticas Avanzadas", description: "Gráficos interactivos y reportes detallados para tomar decisiones informadas.", color: "from-purple-500 to-purple-600" },
        { icon: Bell, title: "Alertas Inteligentes", description: "Notificaciones automáticas de stock bajo, caducidad y reabastecimiento.", color: "from-orange-500 to-red-500" },
        { icon: Shield, title: "Seguridad Total", description: "Datos encriptados y roles de usuario para máxima seguridad hospitalaria.", color: "from-theme-primary-light to-theme-primary" },
        { icon: Users, title: "Gestión de Personal", description: "Control de accesos y seguimiento de actividades del equipo médico.", color: "from-pink-500 to-pink-600" },
        { icon: BarChart3, title: "Reportes Detallados", description: "Genera reportes personalizados y exporta datos en múltiples formatos.", color: "from-indigo-500 to-indigo-600" },
    ];
    const stats = [
        { value: "10K+", label: "Productos Gestionados" },
        { value: "500+", label: "Hospitales Activos" },
        { value: "99.9%", label: "Uptime Garantizado" },
        { value: "24/7", label: "Soporte Técnico" },
    ];
    const steps = [
        { number: "01", title: "Regístrate", description: "Crea tu cuenta en menos de 2 minutos. Sin tarjeta de crédito requerida.", icon: Users, },
        { number: "02", title: "Configura", description: "Importa tu inventario actual o empieza desde cero con nuestro asistente.", icon: Workflow, },
        { number: "03", title: "Gestiona", description: "Controla entradas, salidas y alertas desde un solo dashboard intuitivo.", icon: BarChart, },
        { number: "04", title: "Optimiza", description: "Analiza datos en tiempo real y toma decisiones informadas.", icon: TrendingUp, },
    ];
    const testimonials = [
        { name: "Dr. Carlos Mendoza", role: "Director Médico", hospital: "Hospital General del Sur", content: "MediStock transformó completamente nuestra gestión de inventario. Redujimos pérdidas por caducidad en un 85% en solo 3 meses.", rating: 5, },
        { name: "Lic. Ana Martínez", role: "Jefa de Farmacia", hospital: "Clínica Santa María", content: "La mejor inversión que hemos hecho. El sistema de alertas nos ha salvado múltiples veces de quedarnos sin medicamentos críticos.", rating: 5, },
        { name: "Dr. Roberto García", role: "Administrador", hospital: "Centro Médico Integral", content: "Increíble soporte y facilidad de uso. Todo el equipo se adaptó en menos de una semana. Los reportes son muy detallados.", rating: 5, },
    ];
    const pricing = [
        { name: "Básico", price: "Gratis", description: "Perfecto para clínicas pequeñas", features: [{ text: "Hasta 500 productos", included: true }, { text: "Alertas básicas", included: true }, { text: "2 usuarios", included: true }, { text: "Soporte por email", included: true }, { text: "Reportes básicos", included: true }, { text: "Analíticas avanzadas", included: false }, { text: "API access", included: false },], cta: "Empezar Gratis", popular: false, },
        { name: "Profesional", price: "$99", period: "/mes", description: "Para hospitales medianos", features: [{ text: "Productos ilimitados", included: true }, { text: "Alertas inteligentes", included: true }, { text: "10 usuarios", included: true }, { text: "Soporte prioritario 24/7", included: true }, { text: "Reportes personalizados", included: true }, { text: "Analíticas avanzadas", included: true }, { text: "API access", included: false },], cta: "Prueba 30 días gratis", popular: true, },
        { name: "Empresarial", price: "Contactar", description: "Para grandes instituciones", features: [{ text: "Todo de Profesional", included: true }, { text: "Usuarios ilimitados", included: true }, { text: "Soporte dedicado", included: true }, { text: "Capacitación personalizada", included: true }, { text: "Integraciones personalizadas", included: true, }, { text: "SLA garantizado", included: true }, { text: "API access completo", included: true },], cta: "Hablar con Ventas", popular: false, },
    ];
    const faqs = [
        { question: "¿Necesito conocimientos técnicos para usar MediStock?", answer: "No, MediStock está diseñado para ser intuitivo. Si puedes usar WhatsApp o email, puedes usar MediStock. Además ofrecemos capacitación gratuita.", },
        { question: "¿Cómo protegen mis datos médicos?", answer: "Usamos encriptación de nivel bancario (AES-256) y cumplimos con todas las regulaciones de protección de datos médicos. Tus datos están más seguros que en papel.", },
        { question: "¿Puedo importar mi inventario actual?", answer: "Sí, aceptamos importación desde Excel, CSV y la mayoría de sistemas existentes. Nuestro equipo te ayuda con la migración sin costo.", },
        { question: "¿Funciona sin internet?", answer: "Sí, MediStock es una PWA que funciona offline. Los datos se sincronizan automáticamente cuando recuperas conexión.", },
        { question: "¿Qué pasa si necesito más usuarios después?", answer: "Puedes agregar usuarios en cualquier momento. El cambio de plan es instantáneo y solo pagas la diferencia prorrateada.", },
        { question: "¿Ofrecen capacitación?", answer: "Sí, todos los planes incluyen capacitación inicial. Los planes Profesional y Empresarial incluyen sesiones ilimitadas de entrenamiento.", },
    ];


    return (
        <div className="min-h-screen bg-gradient-to-br from-theme-primary/10 via-white to-theme-primary/10 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 transition-colors overflow-x-hidden scroll-smooth">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href={`/${locale}`} className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center shadow-lg shadow-theme-primary/30 transition-transform duration-300 group-hover:scale-110">
                                <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-theme-primary transition-colors">MediStock</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Características</a>
                            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Precios</a>
                            <Link href={`/${locale}/auth/login`} className="text-gray-600 dark:text-gray-300 hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Iniciar Sesión</Link>
                            <Link href={`/${locale}/auth/sign-up`} className="bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-6 py-2 rounded-xl shadow-lg shadow-theme-primary/30 hover:shadow-xl hover:shadow-theme-primary/40 transition-all">Empezar Gratis</Link>
                        </div>

                        <div className="md:hidden flex items-center gap-4">
                            <Link href={`/${locale}/auth/login`} className="text-gray-600 dark:text-gray-300 hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Login</Link>
                            <Link href={`/${locale}/auth/sign-up`} className="bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-4 py-2 rounded-xl shadow-lg">Empezar</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[700px] flex items-center">
                <div className="absolute inset-0"><MinimalHero isDark={isDark} /></div>
                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="hero-title inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl text-theme-primary-dark dark:text-theme-primary-light rounded-full mb-8 border border-theme-primary/30/50 dark:border-theme-primary-dark/50 shadow-sm">
                            <Zap size={16} className="text-theme-primary dark:text-theme-primary-light" />
                            <span className="text-sm">Sistema #1 en gestión hospitalaria</span>
                        </div>
                        <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                            Control de Inventario<br />
                            <span className="bg-gradient-to-r from-theme-primary to-theme-primary-dark bg-clip-text text-transparent">Hospitalario Inteligente</span>
                        </h1>
                        <p className="hero-subtitle text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                            Gestiona medicamentos, equipos e insumos médicos de forma eficiente y segura. Optimiza tu inventario con tecnología de última generación.
                        </p>
                        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={`/${locale}/auth/sign-up`} className="w-full sm:w-auto bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-8 py-4 rounded-2xl shadow-lg shadow-theme-primary/30 hover:shadow-xl hover:shadow-theme-primary/30 transition-all flex items-center justify-center gap-2 group">
                                <span className="text-lg font-semibold">Crear Cuenta Gratis</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link href={`/${locale}/auth/login`} className="w-full sm:w-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 px-8 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-theme-primary dark:hover:border-theme-primary hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm group">
                                <span className="text-lg font-semibold">Iniciar Sesión</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                        <div className="hero-buttons flex flex-wrap items-center justify-center gap-4 mt-12 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2"><Check className="text-theme-primary" size={16} /><span>Sin tarjeta de crédito</span></div>
                            <div className="flex items-center gap-2"><Check className="text-theme-primary" size={16} /><span>Setup en 5 minutos</span></div>
                            <div className="flex items-center gap-2"><Check className="text-theme-primary" size={16} /><span>Soporte 24/7</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item text-center">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-theme-primary dark:text-theme-primary-light mb-2">{stat.value}</div>
                                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Todo lo que necesitas</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Una plataforma completa para la gestión hospitalaria moderna</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="feature-card group bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary dark:hover:border-theme-primary transition-all hover:shadow-2xl hover:shadow-theme-primary/20 cursor-pointer shadow-lg" onMouseEnter={(e) => { gsap.to(e.currentTarget, { y: -8, duration: 0.3 }); gsap.to(e.currentTarget.querySelector(".feature-icon"), { rotate: 5, scale: 1.1, duration: 0.3 }); }} onMouseLeave={(e) => { gsap.to(e.currentTarget, { y: 0, duration: 0.3 }); gsap.to(e.currentTarget.querySelector(".feature-icon"), { rotate: 0, scale: 1, duration: 0.3 }); }}>
                                    <div className={`feature-icon w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}><Icon className="text-white" size={28} /></div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Empieza en 4 pasos simples</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">De la configuración a la optimización en minutos, no días</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative group">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all h-full">
                                        <div className="text-6xl font-bold text-theme-primary/10 dark:text-theme-primary-light/10 mb-4">{step.number}</div>
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center mb-4 shadow-lg shadow-theme-primary/30"><Icon className="text-white" size={24} /></div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                    {index < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-theme-primary/50 to-transparent" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Casos de éxito reales</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Descubre cómo MediStock está transformando hospitales</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all flex flex-col">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <Quote className="w-10 h-10 text-theme-primary/20 dark:text-theme-primary-light/20 mb-4" />
                                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed flex-grow">"{testimonial.content}"</p>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                                    <p className="text-sm text-theme-primary dark:text-theme-primary-light font-medium">{testimonial.hospital}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Planes para cada necesidad</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Desde clínicas pequeñas hasta grandes redes hospitalarias</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {pricing.map((plan, index) => (
                            <div key={index} className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border transition-all flex flex-col ${plan.popular ? "border-theme-primary dark:border-theme-primary/60 shadow-2xl shadow-theme-primary/10" : "border-gray-200 dark:border-gray-700 hover:border-theme-primary"}`}>
                                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">Más Popular</div>}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                                    <div className="flex items-end justify-center gap-1 mb-2">
                                        <span className="text-4xl font-bold text-theme-primary dark:text-theme-primary-light">{plan.price}</span>
                                        {plan.period && <span className="text-gray-600 dark:text-gray-400 mb-1">{plan.period}</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                                </div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {feature.included ? <CheckCircle2 className="w-5 h-5 text-theme-primary dark:text-theme-primary-light flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />}
                                            <span className={feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={plan.name === 'Empresarial' ? `/${locale}/contacto` : `/${locale}/auth/sign-up`} className={`w-full block py-3 text-center rounded-xl transition-all font-semibold ${plan.popular ? "bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white shadow-lg shadow-theme-primary/30 hover:shadow-xl" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-theme-primary"}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Preguntas frecuentes</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Todo lo que necesitas saber sobre MediStock</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details key={index} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <div className="flex items-start gap-4">
                                        <HelpCircle className="w-5 h-5 text-theme-primary dark:text-theme-primary-light flex-shrink-0 mt-1" />
                                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{faq.question}</span>
                                    </div>
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 pt-0"><p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-9">{faq.answer}</p></div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-theme-primary to-theme-primary-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                        <Smartphone className="text-white" size={32} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para optimizar tu inventario?</h2>
                    <p className="text-lg sm:text-xl text-theme-primary-light mb-10 max-w-2xl mx-auto">Únete a cientos de hospitales que ya confían en MediStock para su gestión diaria.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href={`/${locale}/auth/sign-up`} className="w-full sm:w-auto bg-white text-theme-primary-dark font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all text-lg flex items-center gap-2 group">
                            <span>Comenzar Ahora</span><ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <Link href={`/${locale}/auth/login`} className="w-full sm:w-auto bg-theme-primary-dark/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-theme-primary-dark/50 transition-all text-lg font-semibold">
                            Ver Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center"><Activity className="w-6 h-6 text-white" strokeWidth={2.5} /></div>
                                <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">MediStock</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md">Sistema de control de inventario hospitalario diseñado para profesionales de la salud.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Producto</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li><a href="#features" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Características</a></li>
                                <li><a href="#pricing" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Precios</a></li>
                                <li><Link href={`/${locale}/auth/login`} className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Demo</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Acerca de</a></li>
                                <li><a href="#" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Contacto</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 MediStock. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <a href="#" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Términos</a>
                            <a href="#" className="hover:text-theme-primary dark:hover:text-theme-primary-light transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
