// components/shared/GradientStatCard.tsx - CON FRAMER MOTION
"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface GradientStatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    icon?: LucideIcon;
    gradientFrom: string;
    gradientTo: string;
    delay?: number;
}

export function GradientStatCard({
                                     title,
                                     value,
                                     trend,
                                     trendType = 'up',
                                     icon: Icon,
                                     gradientFrom,
                                     gradientTo,
                                     delay = 0
                                 }: GradientStatCardProps) {
    const [displayValue, setDisplayValue] = useState('0');

    // Motion value para el contador animado
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        stiffness: 100,
        damping: 30,
        duration: 1500
    });

    // Animar el número cuando cambie el value
    useEffect(() => {
        const numValue = parseInt(value.replace(/\D/g, ''));

        if (!isNaN(numValue)) {
            // Animar desde 0 hasta el valor final
            setTimeout(() => {
                motionValue.set(numValue);
            }, delay * 1000 + 300);

            // Actualizar el display mientras se anima
            const unsubscribe = springValue.on('change', (latest) => {
                const currentVal = Math.floor(latest);

                // Preservar prefijos/sufijos del valor original
                if (value.includes('$') && value.includes('M')) {
                    const decimal = Math.floor((latest % 1) * 10);
                    setDisplayValue(`$${currentVal}.${decimal}M`);
                } else if (value.includes('$')) {
                    setDisplayValue('$' + currentVal.toLocaleString());
                } else if (value.includes('M')) {
                    const decimal = Math.floor((latest % 1) * 10);
                    setDisplayValue(`${currentVal}.${decimal}M`);
                } else if (value.includes(',')) {
                    setDisplayValue(currentVal.toLocaleString());
                } else {
                    setDisplayValue(currentVal.toString());
                }
            });

            return () => unsubscribe();
        } else {
            // Si no es un número, mostrar el valor tal cual
            setDisplayValue(value);
        }
    }, [value, delay, motionValue, springValue]);

    // Variantes de animación
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    // Determinar color de sombra basado en el gradiente
    const shadowColor =
        gradientFrom.includes('emerald') || gradientFrom.includes('green') ? 'rgba(16, 185, 129, 0.6)' :
            gradientFrom.includes('orange') ? 'rgba(249, 115, 22, 0.6)' :
                gradientFrom.includes('blue') ? 'rgba(59, 130, 246, 0.6)' :
                    gradientFrom.includes('purple') ? 'rgba(168, 85, 247, 0.6)' :
                        gradientFrom.includes('red') ? 'rgba(239, 68, 68, 0.6)' :
                            'rgba(168, 85, 247, 0.6)';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            className={`rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-shadow bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
            style={{
                boxShadow: `0 20px 60px -15px ${shadowColor}`
            }}
        >
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute right-1/4 top-1/3 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm text-white font-medium">{title}</h3>
                    <motion.div
                        className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        {Icon && <Icon size={24} className="text-white drop-shadow-lg" />}
                    </motion.div>
                </div>

                <div className="text-4xl mb-3 text-white drop-shadow-lg font-bold">
                    <span>{displayValue}</span>
                </div>

                {trend && (
                    <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + 0.5 }}
                    >
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-white/25 backdrop-blur-sm text-white shadow-lg">
                            {trendType === 'up' ? (
                                <TrendingUp size={12} />
                            ) : trendType === 'down' ? (
                                <TrendingDown size={12} />
                            ) : null}
                            <span className="font-medium">{trend}</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}