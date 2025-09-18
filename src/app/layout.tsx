import './globals.css';
import { Providers } from '@/app/providers/tanstack-provider';
import { LanguageProvider } from '@/app/providers/lang-provider';
import { AuthProvider } from '@/app/providers/session-provider';
import { TranslationProvider } from '@/app/providers/translation-provider';
import { metadata, siteConfig, viewport } from '@/configs/site';

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${siteConfig.fonts.inter.variable} antialiased min-h-screen w-full h-full`}
      >
        <TranslationProvider>
          <AuthProvider>
            <LanguageProvider>
              <Providers>{children}</Providers>
            </LanguageProvider>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
