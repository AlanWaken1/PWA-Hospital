"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  nombre_completo: string;
  rol: string;
  departamento?: string;
  telefono?: string;
  avatar_url?: string;
  esta_activo: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  nombre_completo: string;
  rol: string;
  departamento?: string;
  telefono?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular check de sesión inicial
    const checkUser = async () => {
      try {
        // Aquí iría la lógica real de Supabase:
        // const { data: { session } } = await supabase.auth.getSession();
        // if (session?.user) { ... }
        
        // Por ahora simulamos con localStorage
        const storedUser = localStorage.getItem('medistock_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simulación - Reemplazar con Supabase real:
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      
      // Simulación de usuario
      const mockUser: User = {
        id: '123',
        email,
        nombre_completo: 'Farm. María López',
        rol: 'farmaceutico',
        departamento: 'Farmacia Central',
        telefono: '+52 55 1234-5678',
        esta_activo: true,
      };

      localStorage.setItem('medistock_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      // Simulación - Reemplazar con Supabase real:
      // 1. Crear usuario en auth.users
      // const { data: authData, error: authError } = await supabase.auth.signUp({
      //   email: data.email,
      //   password: data.password,
      // });
      // if (authError) throw authError;

      // 2. Crear perfil en public.profiles
      // const { error: profileError } = await supabase
      //   .from('profiles')
      //   .insert({
      //     id: authData.user.id,
      //     nombre_completo: data.nombre_completo,
      //     email: data.email,
      //     rol: data.rol,
      //     departamento: data.departamento,
      //     telefono: data.telefono,
      //   });
      // if (profileError) throw profileError;

      const mockUser: User = {
        id: Math.random().toString(),
        email: data.email,
        nombre_completo: data.nombre_completo,
        rol: data.rol,
        departamento: data.departamento,
        telefono: data.telefono,
        esta_activo: true,
      };

      localStorage.setItem('medistock_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // await supabase.auth.signOut();
      localStorage.removeItem('medistock_user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
