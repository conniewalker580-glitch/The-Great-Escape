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
          </AccessibilityProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
