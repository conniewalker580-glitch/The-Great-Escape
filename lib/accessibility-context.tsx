"use client";

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';

type AccessibilitySettings = {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    screenReaderMode: boolean;
    keyboardNavigation: boolean;
};

type AccessibilityContextType = {
    settings: AccessibilitySettings;
    updateSettings: (settings: Partial<AccessibilitySettings>) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        return {
            highContrast: false,
            reducedMotion: false,
            largeText: false,
            screenReaderMode: false,
            keyboardNavigation: true,
        };
    });

    const [, startTransition] = useTransition();

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('accessibility_settings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                startTransition(() => {
                    setSettings(parsed);
                });
            } catch (e) {
                console.error("Failed to parse accessibility settings", e);
            }
        }

        // Detect system preferences
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

        startTransition(() => {
            if (reducedMotionQuery.matches) {
                setSettings(prev => ({ ...prev, reducedMotion: true }));
            }
            if (highContrastQuery.matches) {
                setSettings(prev => ({ ...prev, highContrast: true }));
            }
        });
    }, []);

    useEffect(() => {
        // Apply settings to document
        document.documentElement.classList.toggle('high-contrast', settings.highContrast);
        document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
        document.documentElement.classList.toggle('large-text', settings.largeText);

        // Save to localStorage
        localStorage.setItem('accessibility_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSettings }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
}
