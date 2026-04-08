import type { Metadata } from "next";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/700.css";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/700.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "ChinaVerse",
  description: "A bilingual platform for learning Chinese culture.",
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
