import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import HeroSearch from '@/components/HeroSearch';
import CategoryGrid from '@/components/CategoryGrid';
import content from '@/data/content.json';
import { cn } from '@/lib/utils';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');

  return (
    <main className="relative overflow-hidden">
      {/* Section 1: Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-8 overflow-hidden bg-[#FAF8F5]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-transparent to-[#FAF8F5] z-10"></div>
          <div className="w-full h-full bg-surface-container-low opacity-50 scale-105"></div>
        </div>
        <div className="relative z-20 text-center max-w-5xl pt-10">
          <div className="flex justify-center mb-10 translate-y-[-20px]">
             <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#9e2016]/40 to-transparent"></div>
          </div>
          <div className="flex justify-center mb-6">
            <span className="vertical-text text-[#9e2016] font-serif text-2xl tracking-[0.5em] opacity-80 leading-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {lang === 'en' ? '五千年文明' : '5,000+ Years'}
            </span>
          </div>
          <h1 className="font-serif text-7xl md:text-9xl font-black text-[#1b1c1a] tracking-tighter mb-12">
            {lang === 'en' ? 'ChinaVerse' : '中华宇宙'} <br/>
            <span className="text-[#9e2016] block md:inline opacity-90">{lang === 'en' ? '中华宇宙' : 'ChinaVerse'}</span>
          </h1>
          
          <HeroSearch 
            lang={lang} 
            placeholder={lang === 'en' ? "Explore the Living Scroll... 探索活着的画卷..." : "探索活着的画卷... Explore the Living Scroll..."} 
          />
          
          <p className="mt-10 text-sm font-sans text-[#1b1c1a]/40 tracking-widest uppercase">
            {lang === 'en' ? 'An Immersive Digital Heritage Project' : '沉浸式数字遗产项目'}
          </p>
        </div>
      </section>

      {/* Section 2: Featured Blog Posts Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto bg-[#FAF8F5]">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-serif text-5xl font-black mb-4 uppercase tracking-tighter">{dict.sections.featured_title}</h2>
            <p className="text-[#1b1c1a]/60 font-sans max-w-lg">{dict.sections.featured_subtitle}</p>
          </div>
          <Link href={`/${lang}/blog`} className="group flex items-center gap-2 text-[#9e2016] font-sans text-sm font-bold border-b border-[#9e2016]/20 pb-1 hover:border-[#9e2016] transition-all">
            {dict.btn.view_all} <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.posts.slice(0, 3).map((post: any, idx: number) => (
            <Link 
              key={post.slug} 
              href={`/${lang}/blog/${post.slug}`}
              className={cn(
                "group relative space-y-6 block",
                idx === 1 && "md:translate-y-16",
                idx === 2 && "md:translate-y-32"
              )}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 relative group-hover:shadow-2xl transition-all duration-700">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 {/* Premium placeholder for missing images */}
                 <div className="w-full h-full bg-[#1b1c1a]/5 flex items-center justify-center overflow-hidden">
                    <div className="text-[200px] font-serif font-black text-[#9e2016]/5 absolute select-none">
                      {post.category.charAt(0)}
                    </div>
                    {/* Background image div */}
                    <div 
                       className="relative z-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                       style={{ backgroundImage: `url(${post.image})` }}
                    ></div>
                 </div>
              </div>
              <div className="space-y-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#9e2016]/5 text-[#9e2016] text-[10px] font-sans font-black uppercase tracking-widest">
                  {post.category}
                </span>
                <h3 className="font-serif text-3xl font-bold group-hover:text-[#9e2016] transition-colors leading-tight tracking-tight">
                  {post[lang].title}
                </h3>
                <p className="text-sm text-[#1b1c1a]/50 line-clamp-2 font-sans italic opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                  {post[lang].excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3: Category Navigation */}
      <section className="py-64 bg-[#FAF8F5] relative">
        <div className="px-8 max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <span className="font-sans text-xs text-[#9e2016] font-black tracking-[0.4em] uppercase opacity-80">
               {lang === 'en' ? 'Cultural Ecosystem' : '文化生态系统'}
            </span>
            <h2 className="font-serif text-6xl font-black text-[#1b1c1a] tracking-tight">{dict.sections.categories_title}</h2>
            <div className="w-16 h-[2px] bg-[#9e2016]/20 mx-auto"></div>
          </div>
          
          <CategoryGrid lang={lang} dict={dict} />
        </div>
      </section>

      {/* Section 4: Start Learning CTA */}
      <section className="py-48 px-8 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto bg-[#1b1c1a] rounded-[40px] p-16 md:p-32 relative overflow-hidden text-center text-white shadow-2xl shadow-black/30">
          {/* Decorative vertical lines */}
          <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-white/5"></div>
          <div className="absolute right-10 top-0 bottom-0 w-[1px] bg-white/5"></div>
          
          <div className="relative z-10 space-y-12">
            <h2 className="font-serif text-5xl md:text-7xl font-black leading-tight">
               {dict.btn.start_learning} <br/>
               <span className="opacity-40 italic serif-light">
                  {lang === 'en' ? '开启您的沉浸之旅' : 'Begin Your Immersion'}
               </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-serif leading-relaxed">
               {dict.sections.newsletter_subtitle}
            </p>
            <div className="flex justify-center pt-8">
              <Link href={`/${lang}/lessons`} className="bg-[#D4A017] text-[#1b1c1a] px-16 py-6 rounded-full font-serif font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#D4A017]/40 flex items-center gap-4">
                {dict.btn.start_learning} 
                <span className="text-2xl opacity-40">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] text-[#1b1c1a] pt-32 pb-12 px-8 border-t border-[#1b1c1a]/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="text-3xl font-serif text-[#9e2016] font-black italic tracking-tighter">ChinaVerse <br/> 中华宇宙</div>
            <p className="text-sm font-sans text-[#1b1c1a]/60 leading-relaxed uppercase tracking-widest">
              {lang === 'en' ? 'Preserving the intangible, celebrating the timeless. A digital scroll for the global citizen.' : '保存无形之美，歌颂永恒之魂。为全球公民打造的数字长卷。'}
            </p>
          </div>
          <div>
            <h5 className="font-sans font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-30">
               {lang === 'en' ? 'Cultures 文化' : '文化遗产'}
            </h5>
            <ul className="space-y-6 text-sm font-sans font-bold">
              <li><Link className="hover:text-[#9e2016] transition-colors" href={`/${lang}/landmarks`}>{dict.category.history}</Link></li>
              <li><Link className="hover:text-[#9e2016] transition-colors" href={`/${lang}/blog`}>{dict.nav.blog}</Link></li>
              <li><Link className="hover:text-[#9e2016] transition-colors" href={`/${lang}/lessons`}>{dict.nav.learn}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-sans font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-30">
               {lang === 'en' ? 'Social 社交' : '社交平台'}
            </h5>
            <ul className="space-y-6 text-sm font-sans font-bold">
              <li><Link className="hover:text-[#9e2016] transition-colors" href="#">Bilibili 哔哩哔哩</Link></li>
              <li><Link className="hover:text-[#9e2016] transition-colors" href="#">WeChat 微信</Link></li>
              <li><Link className="hover:text-[#9e2016] transition-colors" href="#">Weibo 微博</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-sans font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-30">
               {lang === 'en' ? 'Experience 体验' : '体验项目'}
            </h5>
            <ul className="space-y-6 text-sm font-sans font-bold">
              <li><Link className="hover:text-[#9e2016] transition-colors" href="#">{lang === 'en' ? 'VR Exploration VR探索' : 'VR探索'}</Link></li>
              <li><Link className="hover:text-[#9e2016] transition-colors" href="#">Digital Archives 数字档案</Link></li>
              <li><Link className="hover:text-[#9e2016] transition-colors" href="#">Calligraphy Lab 书法实验室</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-[#1b1c1a]/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] opacity-20">
            © 2026 ChinaVerse 中华宇宙. 京ICP备12345678号.
          </p>
          <div className="flex gap-8 text-[10px] font-sans font-black uppercase tracking-[0.2em] opacity-40">
             <Link href="#">Privacy Policy</Link>
             <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
