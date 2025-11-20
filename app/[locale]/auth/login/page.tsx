// app/[locale]/auth/login/page.tsx
"use client";

import { useRef, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { Activity } from "lucide-react";
import LoginForm from "@/components/auth/login-form";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  return <LoginForm message={message} />;
}

export default function Page() {
  const t = useTranslations('app');
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-theme-primary/10 via-white to-theme-primary/10 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 flex items-center justify-center p-4 transition-colors"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div ref={logoRef} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-primary-dark rounded-2xl shadow-lg shadow-theme-primary/30 mb-4">
            <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Bienvenido a {t('name')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('tagline')}</p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-500">{useTranslations('common')('loading')}</div>}>
          <LoginContent />
        </Suspense>

        <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
          © {new Date().getFullYear()} {t('name')}. Sistema seguro y confiable para hospitales.
        </p>
      </div>
    </div>
  );
}
