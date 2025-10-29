import { ReactNode, useState, useRef, useEffect } from 'react';
import { HospitalSidebar } from './HospitalSidebar';
import { Menu, X, Search, Mail, Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import gsap from 'gsap';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  // Get user initials
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <HospitalSidebar 
          currentPage={currentPage} 
          onPageChange={(page) => {
            onPageChange(page);
            setSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div
          ref={headerRef}
          className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Mobile Menu + Search */}
              <div className="flex items-center gap-3 flex-1 max-w-2xl">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {sidebarOpen ? (
                    <X className="text-gray-600 dark:text-gray-300" size={20} />
                  ) : (
                    <Menu className="text-gray-600 dark:text-gray-300" size={20} />
                  )}
                </button>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar medicamento, equipo o insumo..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>

              {/* Right: Actions + User Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mail Icon */}
                <button
                  className="hidden sm:flex w-9 h-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                  <Mail size={18} className="text-gray-600 dark:text-gray-300" />
                </button>

                {/* Bell Icon with notification badge */}
                <button
                  className="relative w-9 h-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">3</span>
                  </div>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-700">
                  <Avatar className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer hover:ring-2 hover:ring-theme-primary/50 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-theme-primary-light to-theme-primary text-white text-sm">
                      {getInitials(user?.nombre_completo)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* User Info - Hidden on mobile */}
                  <div className="hidden md:block text-right">
                    <div className="text-sm text-gray-900 dark:text-gray-100 leading-tight">
                      {user?.nombre_completo || 'Usuario'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                      {user?.email || user?.departamento || 'Hospital'}
                    </div>
                  </div>

                  {/* Dropdown Arrow - Hidden on mobile */}
                  <ChevronDown size={16} className="hidden md:block text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
