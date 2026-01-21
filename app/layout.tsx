import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { ClerkProvider } from '@clerk/nextjs';

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
    <ClerkProvider>
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
              <p>The Great Escape © 2025 | Owner: C.S. Walker</p>
              <p className="mt-2">Contact: <a href="mailto:snapmoodsai.gmail@gmail.com" className="text-zinc-500 hover:text-cyan-500 transition-colors">snapmoodsai.gmail@gmail.com</a></p>
            </footer>
          </AccessibilityProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

