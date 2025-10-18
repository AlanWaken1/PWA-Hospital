// app/(auth)/sign-up/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Mail, Lock, Activity, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                logoRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
            );

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
        setError('');
        setSuccess(false);

        // Validaciones
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            // Registrar usuario
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nombre_completo: nombre,
                        rol: 'enfermera', // rol por defecto
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                setSuccess(true);
                // Esperar 2 segundos y redirigir al login
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 flex items-center justify-center p-4"
        >
            <div className="w-full max-w-md">
                {/* Logo */}
                <div ref={logoRef} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-500/30 mb-4">
                        <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-semibold text-foreground mb-2">
                        Crear Cuenta en MediStock
                    </h1>
                    <p className="text-muted-foreground">
                        Únete al sistema de gestión hospitalaria
                    </p>
                </div>

                {/* Sign Up Form */}
                <div
                    ref={formRef}
                    className="bg-card rounded-2xl shadow-xl border border-border p-8"
                >
                    <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                        Registrarse
                    </h2>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            ¡Cuenta creada exitosamente! Redirigiendo al login...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nombre Completo */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="pl-10 bg-input-background border-border h-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-input-background border-border h-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-input-background border-border h-11"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-input-background border-border h-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-6 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-0"
                            onMouseEnter={(e) => {
                                if (!loading && !success) {
                                    gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading && !success) {
                                    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                                }
                            }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="font-medium">Crear Cuenta</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">
                ¿Ya tienes cuenta?
              </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link
                        href="/login"
                        className="block w-full text-center text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                    >
                        Iniciar sesión →
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    © 2024 MediStock. Sistema seguro y confiable para hospitales.
                </p>
            </div>
        </div>
    );
}