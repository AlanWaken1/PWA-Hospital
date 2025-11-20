// middleware.ts - VERSIÓN OFFLINE-AWARE + I18N
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Crear middleware de internacionalización
const intlMiddleware
    = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
    // 1. Primero manejar i18n
    const pathname = request.nextUrl.pathname;

    // Verificar si la ruta ya tiene un locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Si no tiene locale, redirigir con el locale por defecto
    if (!pathnameHasLocale && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
        // Obtener locale preferido de cookie o usar el por defecto
        const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
        const newUrl = new URL(`/${locale}${pathname}`, request.url);
        return NextResponse.redirect(newUrl);
    }

    // 2. Manejar autenticación con Supabase
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: any) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    try {
        // Intentar obtener usuario
        const { data: { user }, error } = await supabase.auth.getUser()

        // Extraer locale de la ruta
        const locale = pathname.split('/')[1];

        const isAuthPage = pathname === `/${locale}` ||
            pathname === `/${locale}/auth/login` ||
            pathname === `/${locale}/auth/register` ||
            pathname === '/'

        const isProtectedPage = !isAuthPage

        // Si hay error de conexión y es una página protegida, permitir acceso
        // (el AuthContext manejará la sesión offline)
        if (error && error.message.includes('fetch')) {
            console.log('⚠️ Middleware: Error de conexión, permitiendo acceso offline')
            return response
        }

        // Si no hay usuario y está en página protegida, redirigir a login
        if (!user && isProtectedPage) {
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
        }

        // Si hay usuario y está en página de auth, redirigir a dashboard
        if (user && isAuthPage) {
            return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
        }

        return response
    } catch (error) {
        // Si hay error de red, permitir acceso (modo offline)
        console.log('⚠️ Middleware: Error de red, modo offline activado')
        return response
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/manifest|api/auth|sw.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

