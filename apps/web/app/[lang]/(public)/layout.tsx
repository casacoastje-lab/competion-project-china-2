import { getDictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar lang={lang} dict={dict} />
      <main className="flex-grow pt-20">
        {children}
      </main>
    </div>
  );
}
