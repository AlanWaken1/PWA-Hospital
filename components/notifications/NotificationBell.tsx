// components/notifications/NotificationBell.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
    const { unreadCount, requestPermission } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const bellRef = useRef<HTMLButtonElement>(null);
    const prevCountRef = useRef(unreadCount);

    // Request notification permission on mount
    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    // Animate when new notification arrives
    useEffect(() => {
        if (unreadCount > prevCountRef.current && !hasAnimated) {
            setHasAnimated(true);
            setTimeout(() => setHasAnimated(false), 1000);
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount, hasAnimated]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                const dropdown = document.getElementById('notification-dropdown');
                if (dropdown && !dropdown.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                ref={bellRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`
          relative w-10 h-10 flex items-center justify-center rounded-xl
          transition-all duration-200
          ${isOpen
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
          ${hasAnimated ? 'animate-wiggle' : ''}
        `}
            >
                <Bell className="w-5 h-5" />

                {/* Unread Badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 z-50"
                        id="notification-dropdown"
                    >
                        <NotificationDropdown onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wiggle animation */}
            <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
}