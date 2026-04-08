import Link from 'next/link';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] flex flex-col font-sans overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#9e2016]/5 mix-blend-multiply transition-colors group-hover:bg-[#9e2016]/10"></div>
        {/* Placeholder for the misty mountain background */}
        <div className="w-full h-full bg-gradient-to-br from-white via-[#FAF8F5] to-[#E3DCD2]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#9e2016]/[0.02] -skew-x-12 translate-x-20"></div>
      </div>

      <nav className="relative z-20 p-12 flex justify-between items-center">
        <Link href={`/${lang}`} className="group flex items-center gap-4">
          <div className="w-12 h-12 bg-[#9e2016] rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-white font-serif text-2xl font-black italic -translate-y-0.5">C</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-serif text-2xl font-black text-[#1b1c1a] tracking-tight">ChinaVerse</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016]">{isEn ? 'Imperial Archive' : '文化遗产档案库'}</span>
          </div>
        </Link>
        <div className="hidden sm:block text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/20">
          {isEn ? 'Secure Entrance • Authorized Only' : '安全入口 • 仅限授权访问'}
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6 md:p-12">
        {children}
      </main>

      <footer className="relative z-20 p-12 flex justify-between items-center border-t border-[#1b1c1a]/5">
        <p className="text-[10px] uppercase font-sans font-black tracking-widest text-[#1b1c1a]/40">
           © 2026 ChinaVerse 
        </p>
        <div className="flex gap-8">
           <span className="text-[10px] uppercase font-sans font-black tracking-widest text-[#1b1c1a]/20">Terms</span>
           <span className="text-[10px] uppercase font-sans font-black tracking-widest text-[#1b1c1a]/20">Privacy</span>
        </div>
      </footer>
    </div>
  );
}
