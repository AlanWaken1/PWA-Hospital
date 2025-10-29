// components/sign-up-form.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { Mail, Lock, User, Phone, Building2, Briefcase, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client'; // Cliente Supabase del navegador
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importa Select
import { Label } from '@/components/ui/label'; // Importa Label

// Definimos los roles según tu schema
const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'doctor', label: 'Doctor/a' },
    { value: 'enfermera', label: 'Enfermera/o' },
    { value: 'farmaceutico', label: 'Farmacéutico/a' },
    { value: 'almacenista', label: 'Almacenista' },
    { value: 'tecnico', label: 'Técnico/a' },
];

export function SignUpForm() {
    const router = useRouter();
    // Estado para todos los campos del formulario
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: '',
        departamento: '',
        telefono: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formRef = useRef<HTMLDivElement>(null);

    // Animación GSAP
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                formRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
            );
        });
        return () => ctx.revert();
    }, []);

    // Manejador genérico para cambios en inputs y select
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Limpia errores previos

        // Validaciones (de tu diseño Register.tsx)
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (!formData.rol) {
            setError('Por favor selecciona un rol');
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            // Llamada a Supabase signUp
            const { error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    // ¡Importante! Pasa los datos extra aquí para que el trigger los use
                    data: {
                        nombre_completo: formData.nombre_completo,
                        rol: formData.rol,
                        departamento: formData.departamento || null, // Pasa null si está vacío
                        telefono: formData.telefono || null,       // Pasa null si está vacío
                        // No necesitas pasar email aquí, Supabase ya lo sabe
                    },
                    // Email de redirección (ajusta si es necesario)
                    emailRedirectTo: `${window.location.origin}/auth/callback`, // Callback route es común
                },
            });

            if (signUpError) throw signUpError;

            // Redirige a la página de éxito o espera confirmación
            // El template original redirige a /auth/sign-up-success
            router.push('/auth/sign-up-success');
            // Podrías mostrar un mensaje pidiendo revisar el email

        } catch (err: any) {
            setError(err.message || 'Error al crear la cuenta. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Contenedor del formulario (basado en tu diseño Register.tsx)
        <div
            ref={formRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Crear Cuenta</h2>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-5">
                {/* Usamos grid para el layout de 2 columnas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Nombre Completo */}
                    <div className="sm:col-span-2">
                        <Label htmlFor="nombre_completo" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Nombre Completo *
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <Input
                                id="nombre_completo"
                                type="text"
                                placeholder="Ej: Farm. María López García"
                                value={formData.nombre_completo}
                                onChange={(e) => handleChange('nombre_completo', e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                        <Label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Correo Electrónico *
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@hospital.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Contraseña *
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                required
                                minLength={6} // Añade validación HTML
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label htmlFor="confirmPassword" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Confirmar Contraseña *
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Repite tu contraseña"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Rol */}
                    <div>
                        <Label htmlFor="rol" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Rol en el Hospital *
                        </Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
                            {/* Usamos el componente Select de shadcn/ui */}
                            <Select value={formData.rol} onValueChange={(value) => handleChange('rol', value)}>
                                <SelectTrigger id="rol" className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <SelectValue placeholder="Selecciona tu rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((rol) => (
                                        <SelectItem key={rol.value} value={rol.value}>
                                            {rol.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Departamento */}
                    <div>
                        <Label htmlFor="departamento" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Departamento
                        </Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <Input
                                id="departamento"
                                type="text"
                                placeholder="Ej: Farmacia Central"
                                value={formData.departamento}
                                onChange={(e) => handleChange('departamento', e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="sm:col-span-2">
                        <Label htmlFor="telefono" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Teléfono
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="+52 55 1234-5678"
                                value={formData.telefono}
                                onChange={(e) => handleChange('telefono', e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </div>
                </div> {/* Fin del grid */}

                {/* Terms */}
                <div className="flex items-start gap-3 text-sm">
                    <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-1 rounded border-gray-300 dark:border-gray-600 text-theme-primary focus:ring-theme-primary shadow-sm"
                    />
                    <Label htmlFor="terms" className="text-gray-600 dark:text-gray-400 font-normal">
                        Acepto los{' '}
                        {/* Cambiamos button por Link si tienes páginas para esto */}
                        <Link href="/terminos" className="text-theme-primary dark:text-theme-primary-light hover:underline">
                            términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link href="/privacidad" className="text-theme-primary dark:text-theme-primary-light hover:underline">
                            política de privacidad
                        </Link>
                    </Label>
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
                            <span>Crear Cuenta</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            ¿Ya tienes cuenta?
          </span>
                </div>
            </div>

            {/* Login Link */}
            <Link
                href="/auth/login" // Ruta del template
                className="block w-full text-center text-theme-primary dark:text-theme-primary-light hover:text-theme-primary-dark dark:hover:text-theme-primary-light transition-colors hover:underline"
            >
                Iniciar sesión →
            </Link>
        </div>
    );
}