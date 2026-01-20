"use client";

import React from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Eye, Keyboard, Type, Contrast } from 'lucide-react';

export default function AccessibilitySettings() {
    const { settings, updateSettings } = useAccessibility();

    const toggleSetting = (key: keyof typeof settings) => {
        updateSettings({ [key]: !settings[key] });
    };

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Settings className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-4xl font-bold text-white">Accessibility Settings</h1>
                </div>

                <div className="grid gap-6">
                    {/* High Contrast */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-cyan-400">
                                <Contrast className="w-5 h-5" />
                                High Contrast Mode
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 mb-4">
                                Increases contrast between text and background for better readability.
                            </p>
                            <Button
                                onClick={() => toggleSetting('highContrast')}
                                variant={settings.highContrast ? 'default' : 'outline'}
                                className={settings.highContrast ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
                            >
                                {settings.highContrast ? 'Enabled' : 'Disabled'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reduced Motion */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-cyan-400">
                                <Eye className="w-5 h-5" />
                                Reduce Motion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 mb-4">
                                Minimizes animations and transitions for users sensitive to motion.
                            </p>
                            <Button
                                onClick={() => toggleSetting('reducedMotion')}
                                variant={settings.reducedMotion ? 'default' : 'outline'}
                                className={settings.reducedMotion ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
                            >
                                {settings.reducedMotion ? 'Enabled' : 'Disabled'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Large Text */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-cyan-400">
                                <Type className="w-5 h-5" />
                                Large Text
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 mb-4">
                                Increases font size across the application for easier reading.
                            </p>
                            <Button
                                onClick={() => toggleSetting('largeText')}
                                variant={settings.largeText ? 'default' : 'outline'}
                                className={settings.largeText ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
                            >
                                {settings.largeText ? 'Enabled' : 'Disabled'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Keyboard Navigation */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-cyan-400">
                                <Keyboard className="w-5 h-5" />
                                Keyboard Navigation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 mb-4">
                                Enhanced keyboard shortcuts and focus indicators for navigation without a mouse.
                            </p>
                            <Button
                                onClick={() => toggleSetting('keyboardNavigation')}
                                variant={settings.keyboardNavigation ? 'default' : 'outline'}
                                className={settings.keyboardNavigation ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
                            >
                                {settings.keyboardNavigation ? 'Enabled' : 'Disabled'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Screen Reader Mode */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-cyan-400">
                                <Eye className="w-5 h-5" />
                                Screen Reader Optimizations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 mb-4">
                                Adds ARIA labels and descriptions for better screen reader compatibility.
                            </p>
                            <Button
                                onClick={() => toggleSetting('screenReaderMode')}
                                variant={settings.screenReaderMode ? 'default' : 'outline'}
                                className={settings.screenReaderMode ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
                            >
                                {settings.screenReaderMode ? 'Enabled' : 'Disabled'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 p-6 bg-cyan-950/20 border border-cyan-500/30 rounded-lg">
                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Need Help?</h3>
                    <p className="text-zinc-300 text-sm">
                        If you're experiencing any accessibility issues, please contact our support team. 
                        We're committed to making this game accessible to everyone.
                    </p>
                </div>
            </div>
        </div>
    );
}
