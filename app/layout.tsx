import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from '@/lib/accessibility-context';

const inter = Inter({ subsets: ["latin"] });
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: "The Great Escape",
  description: "Infinite AI-Powered Escape Rooms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#06b6d4' },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
        }
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${inter.className} ${spaceMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <a href="#main-content" className="skip-to-content">Skip to main content</a>
          <AccessibilityProvider>
            <main id="main-content">
              {children}
            </main>
            <footer className="w-full py-6 text-center text-xs text-zinc-600 font-mono border-t border-white/5 bg-black/50">
              <p>Escape Room AI © 2024</p>
              <p className="mt-2">Created by C.S. Walker | <a href="mailto:snapmoodsai@gmail.com" className="text-zinc-500 hover:text-cyan-500 transition-colors">snapmoodsai@gmail.com</a></p>
            </footer>
          </AccessibilityProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
