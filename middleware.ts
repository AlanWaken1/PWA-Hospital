// middleware.ts - VERSIÓN OFFLINE-AWARE
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

        const isAuthPage = request.nextUrl.pathname === '/' ||
            request.nextUrl.pathname === '/auth/login' ||
            request.nextUrl.pathname === '/auth/register'

        const isProtectedPage = !isAuthPage

        // Si hay error de conexión y es una página protegida, permitir acceso
        // (el AuthContext manejará la sesión offline)
        if (error && error.message.includes('fetch')) {
            console.log('⚠️ Middleware: Error de conexión, permitiendo acceso offline')
            return response
        }

        // Si no hay usuario y está en página protegida, redirigir a login
        if (!user && isProtectedPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Si hay usuario y está en página de auth, redirigir a dashboard
        if (user && isAuthPage) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
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

