import Link from 'next/link';
import { getDictionary } from '../../lib/dictionary';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');

  return (
    <>
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAF8F5]/90 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href={`/${lang}`} className="text-2xl font-serif font-bold text-[#9e2016] tracking-tighter italic">
              ChinaVerse 中华宇宙
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href={`/${lang}/landmarks`} className="text-[#9e2016] font-bold border-b-2 border-[#9e2016] pb-1 hover:text-[#9e2016] transition-all duration-300">
                {dict.nav.explore} {lang === 'en' ? '探索' : 'Explore'}
              </Link>
              <Link href={`/${lang}/blog`} className="text-[#1b1c1a]/60 font-medium hover:text-[#9e2016] transition-all duration-300">
                {dict.nav.blog} {lang === 'en' ? '博客' : 'Blog'}
              </Link>
              <Link href={`/${lang}/lessons`} className="text-[#1b1c1a]/60 font-medium hover:text-[#9e2016] transition-all duration-300">
                {dict.nav.learn} {lang === 'en' ? '学习' : 'Learn'}
              </Link>
              <Link href={`/${lang}/landmarks`} className="text-[#1b1c1a]/60 font-medium hover:text-[#9e2016] transition-all duration-300">
                {dict.nav.map} {lang === 'en' ? '地图' : 'Map'}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link href={lang === 'en' ? '/zh' : '/en'} className="text-xs font-sans uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors">
                {lang === 'en' ? 'ZH | 中' : 'EN | English'}
              </Link>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant/30 hidden md:block"></div>
            <button className="flex items-center gap-2 group">
              <span className="text-sm font-sans font-bold text-primary">{dict.nav.login} {lang === 'en' ? '登录' : 'Login'}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        {/* Section 1: Hero */}
        <section className="relative h-screen flex items-center justify-center pt-20 px-8 overflow-hidden bg-[#FAF8F5]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-transparent to-[#FAF8F5] z-10"></div>
            <div className="w-full h-full bg-surface-container-low opacity-50 scale-105"></div>
          </div>
          <div className="relative z-20 text-center max-w-5xl">
            <div className="flex justify-center mb-6">
              <span className="vertical-text text-primary font-serif text-2xl tracking-[0.5em] opacity-80 leading-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {lang === 'en' ? '五千年文明' : '5,000+ Years'}
              </span>
            </div>
            <h1 className="font-serif text-7xl md:text-9xl font-black text-on-surface tracking-tight mb-8">
              {lang === 'en' ? 'ChinaVerse' : '中华宇宙'} <span className="text-primary block md:inline">{lang === 'en' ? '中华宇宙' : 'ChinaVerse'}</span>
            </h1>
            <div className="relative max-w-2xl mx-auto group">
              <input 
                className="w-full bg-white/90 backdrop-blur-md border border-outline-variant/30 px-8 py-5 rounded-full text-lg shadow-xl shadow-primary/5 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                placeholder={lang === 'en' ? "Explore the Living Scroll... 探索活着的画卷..." : "探索活着的画卷... Explore the Living Scroll..."} 
                type="text"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Featured Blog Posts Grid */}
        <section className="py-32 px-8 max-w-7xl mx-auto bg-[#FAF8F5]">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-2">{dict.sections.featured_title}</h2>
              <p className="text-on-surface-variant font-sans">{dict.sections.featured_subtitle}</p>
            </div>
            <Link href={`/${lang}/blog`} className="text-primary font-sans text-sm font-bold border-b border-primary pb-1">{dict.btn.view_all}</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group relative space-y-6">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-container"></div>
              <div className="space-y-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-sans font-bold">
                  {dict.category.art}
                </span>
                <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                  {lang === 'en' ? "The Silent Language of Celadon" : "青瓷的无声语言"} <br/>
                  <span className="text-sm opacity-60 font-normal">{lang === 'en' ? "青瓷的无声语言" : "The Silent Language of Celadon"}</span>
                </h3>
              </div>
            </div>
            <div className="group relative space-y-6 md:translate-y-12">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-container"></div>
              <div className="space-y-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-sans font-bold">
                  {dict.category.travel}
                </span>
                <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                  {lang === 'en' ? "Silk Roads: Weaving the Future" : "丝绸之路：编织未来"} <br/>
                  <span className="text-sm opacity-60 font-normal">{lang === 'en' ? "丝绸之路：编织未来" : "Silk Roads: Weaving the Future"}</span>
                </h3>
              </div>
            </div>
            <Link href={`/${lang}/blog`} className="space-y-6">
              <div className="aspect-[4/5] rounded-lg bg-surface-container-highest/20 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary transition-all">
                <span className="text-primary font-bold">{dict.btn.read_more}</span>
                <span className="text-xs opacity-60">{dict.sections.featured_empty}</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Section 3: Category Navigation */}
        <section className="py-32 bg-[#FAF8F5] relative">
          <div className="px-8 max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="font-sans text-sm text-tertiary font-bold tracking-[0.3em] uppercase">{lang === 'en' ? 'Ecosystem' : '生态系统'}</span>
              <h2 className="font-serif text-5xl font-black mt-4">{dict.sections.categories_title}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link href={`/${lang}/landmarks`} className="col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-xl h-80 md:h-auto bg-surface-variant">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="font-serif text-3xl font-bold">{dict.category.history}</h4>
                </div>
              </Link>
              <div className="relative group cursor-pointer overflow-hidden rounded-xl h-64 bg-white border border-outline-variant/20 p-6 flex flex-col justify-between hover:bg-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                <h4 className="font-serif text-xl font-bold group-hover:text-white transition-colors">{dict.category.language}</h4>
              </div>
              <div className="relative group cursor-pointer overflow-hidden rounded-xl h-64 bg-white border border-outline-variant/20 p-6 flex flex-col justify-between hover:bg-secondary transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/20">
                <h4 className="font-serif text-xl font-bold group-hover:text-white transition-colors">{dict.category.food}</h4>
              </div>
              <div className="relative group cursor-pointer overflow-hidden rounded-xl h-64 bg-white border border-outline-variant/20 p-6 flex flex-col justify-between hover:bg-tertiary transition-all duration-500 hover:shadow-2xl hover:shadow-tertiary/20">
                <h4 className="font-serif text-xl font-bold group-hover:text-white transition-colors">{dict.category.art}</h4>
              </div>
              <div className="relative group cursor-pointer overflow-hidden rounded-xl h-64 bg-white border border-outline-variant/20 p-6 flex flex-col justify-between hover:bg-on-surface transition-all duration-500 hover:shadow-2xl hover:shadow-on-surface/20">
                <h4 className="font-serif text-xl font-bold group-hover:text-white transition-colors">{dict.category.festivals}</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Interactive China Map Preview */}
        <section className="py-32 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 bg-[#FAF8F5]">
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="font-serif text-5xl font-black leading-tight">{dict.sections.map_title}</h2>
            <p className="text-lg text-on-surface-variant font-sans">{dict.sections.map_subtitle}</p>
            <div className="space-y-6">
              <Link href={`/${lang}/landmarks`} className="block p-6 bg-white rounded-lg border border-outline-variant/20 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                <p className="font-bold font-serif mb-1">{lang === 'en' ? "Current Focus: Xi'an (西安)" : "当前关注：西安"}</p>
                <p className="text-sm opacity-70">{lang === 'en' ? "The eastern terminus of the Silk Road and home to the Terracotta Army." : "丝绸之路的东端起点，兵马俑的故乡。"}</p>
                <div className="mt-4 h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
                <p className="mt-2 text-[10px] uppercase font-sans tracking-widest text-primary">{lang === 'en' ? "Mastery: 75%" : "掌握进度：75%"}</p>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative aspect-square bg-white/50 rounded-full flex items-center justify-center p-12 border border-outline-variant/10">
            <div className="w-full h-full bg-surface-variant opacity-60 mix-blend-multiply rounded-full"></div>
            <div className="absolute inset-0 border-[40px] border-[#FAF8F5] pointer-events-none rounded-full flex items-center justify-center">
               <Link href={`/${lang}/landmarks`} className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                  {dict.sections.map_cta}
               </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Start Learning CTA */}
        <section className="py-32 px-8 bg-[#FAF8F5]">
          <div className="max-w-5xl mx-auto bg-[#694d00] rounded-3xl p-12 md:p-24 relative overflow-hidden text-center text-on-tertiary shadow-2xl shadow-[#694d00]/20">
            <div className="relative z-10 space-y-8">
              <h2 className="font-serif text-4xl md:text-6xl font-black">{dict.btn.start_learning}<br/><span className="opacity-80">{lang === 'en' ? '开启您的沉浸之旅' : 'Begin Your Immersion'}</span></h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">{dict.sections.newsletter_subtitle}</p>
              <div className="flex justify-center">
                <Link href={`/${lang}/lessons`} className="bg-[#D4A017] text-on-surface px-12 py-5 rounded-full font-sans font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3">
                  {dict.btn.start_learning}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] text-on-surface pt-16 pb-8 px-8 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-xl font-serif text-[#9e2016] mb-4">ChinaVerse 中华宇宙</div>
            <p className="text-sm font-sans text-on-surface-variant leading-relaxed">
              {lang === 'en' ? 'Preserving the intangible, celebrating the timeless. A digital scroll for the global citizen.' : '保存无形之美，歌颂永恒之魂。为全球公民打造的数字长卷。'}
            </p>
          </div>
          <div>
            <h5 className="font-sans font-bold text-xs uppercase tracking-widest mb-6 opacity-60">{lang === 'en' ? 'Cultures 文化' : '文化'}</h5>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link className="hover:text-primary transition-colors" href={`/${lang}/landmarks`}>{dict.category.history}</Link></li>
              <li><Link className="hover:text-primary transition-colors" href={`/${lang}/blog`}>{dict.nav.blog}</Link></li>
              <li><Link className="hover:text-primary transition-colors" href={`/${lang}/lessons`}>{dict.nav.learn}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-sans font-bold text-xs uppercase tracking-widest mb-6 opacity-60">{lang === 'en' ? 'Social 社交' : '社交'}</h5>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link className="hover:text-primary transition-colors flex items-center gap-2" href="#">Bilibili 哔哩哔哩</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">WeChat 微信</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Weibo 微博</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-sans font-bold text-xs uppercase tracking-widest mb-6 opacity-60">Connect 联系</h5>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link className="hover:text-primary transition-colors" href="#">{lang === 'en' ? 'Contact 联系' : '联系我们'}</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy 隐私</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Terms 条款</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-on-surface-variant/60">
            © 2026 ChinaVerse 中华宇宙. 京ICP备12345678号. The Living Scroll Experience.
          </p>
        </div>
      </footer>
    </>
  );
}
