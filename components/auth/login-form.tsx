// components/login-form.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginForm({ message }: { message: string | null }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    // Usa el mensaje de error de la URL
    const [error, setError] = useState<string | null>(message);

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animación del formulario
        const ctx = gsap.context(() => {
            gsap.fromTo(
                formRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
            );
        });
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpia errores
        setLoading(true);

        const supabase = createClient(); // Crea el cliente de Supabase

        try {
            // Usa la lógica de signInWithPassword del template
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            // Redirige al dashboard (o a donde sea)
            // Usamos router.refresh() para asegurar que la sesión del servidor se actualice
            router.refresh();
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message || 'Email o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={formRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Iniciar Sesión</h2>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-600 text-theme-primary focus:ring-theme-primary"
                        />
                        <span>Recordarme</span>
                    </label>
                    {/* Link a la página de forgot-password del template */}
                    <Link
                        href="/auth/forgot-password"
                        className="text-theme-primary dark:text-theme-primary-light hover:text-theme-primary-dark dark:hover:text-theme-primary-light transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-theme-primary to-theme-primary-dark hover:from-theme-primary-dark hover:to-theme-primary-dark text-white py-2.5 rounded-xl shadow-lg shadow-theme-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    onMouseEnter={(e) => !loading && gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                    onMouseLeave={(e) => !loading && gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Iniciar Sesión</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            ¿No tienes cuenta?
          </span>
                </div>
            </div>

            {/* Link a la página de sign-up del template */}
            <Link
                href="/auth/sign-up"
                className="block w-full text-center text-theme-primary dark:text-theme-primary-light hover:text-theme-primary-dark dark:hover:text-theme-primary-light transition-colors"
            >
                Crear una cuenta nueva →
            </Link>
        </div>
    );
}