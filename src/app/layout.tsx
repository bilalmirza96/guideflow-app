import type { Metadata } from 'next';
import { lora, dmSans } from '@/lib/fonts';
import { ThemeProvider } from '@/lib/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'GuideFlow',
  description: 'Clinical guidelines and residency tracking platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
