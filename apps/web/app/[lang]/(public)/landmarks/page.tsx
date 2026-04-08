'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AmapView from '@/components/AmapView';
import content from '@/data/content.json';
import { Home, Map as MapIcon, BookOpen, GraduationCap, Navigation, RotateCcw } from 'lucide-react';

export default function LandmarksPage({ params }: { params: Promise<{ lang: string }> }) {
  const [lang, setLang] = useState('en');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    params.then(p => setLang(p.lang));
  }, [params]);

  const dict = {
    nav: { explore: lang === 'en' ? 'Explore' : '探索', blog: lang === 'en' ? 'Blog' : '博客', learn: lang === 'en' ? 'Learn' : '学习' },
    category: { history: lang === 'en' ? 'History & Landmarks' : '历史与地标', art: lang === 'en' ? 'Art & Music' : '艺术与音乐', food: lang === 'en' ? 'Food & Traditions' : '美食与传统', festivals: lang === 'en' ? 'Festivals' : '节日庆典', nature: lang === 'en' ? 'Nature' : '自然' },
    sections: { map_subtitle: lang === 'en' ? 'Explore China\'s cultural landmarks' : '探索中国文化地标' },
    btn: { read_now: lang === 'en' ? 'Read Now' : '立即阅读' }
  };

  const categories = [
    { id: null, label: lang === 'en' ? 'All' : '全部' },
    { id: 'History', label: dict.category.history },
    { id: 'Nature', label: dict.category.nature },
    { id: 'Cityscape', label: lang === 'en' ? 'Cityscape' : '城市景观' },
    { id: 'Spiritual', label: lang === 'en' ? 'Spiritual' : '宗教' },
    { id: 'Imperial Garden', label: lang === 'en' ? 'Imperial Garden' : '皇家园林' },
  ];

  const filteredLandmarks = activeCategory 
    ? content.landmarks.filter((l: any) => l.category === activeCategory)
    : content.landmarks;

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setCenter([116.397428, 39.90923]);
      mapRef.current.setZoom(5);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#FAF8F5] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-96 flex-shrink-0 bg-white border-r border-outline-variant/10 flex flex-col z-20 shadow-xl overflow-hidden">
        <header className="p-8 border-b border-outline-variant/10 bg-[#FAF8F5]/30">
          <div className="flex items-center gap-2 text-[#9e2016] mb-6">
             <MapIcon size={20} />
             <span className="text-xs font-sans font-black uppercase tracking-[0.3em]">{lang === 'en' ? 'Geographic Archive' : '地理档案'}</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#1b1c1a]">{dict.nav.explore} <span className="text-[#9e2016]">{lang === 'en' ? '探索' : 'Explore'}</span></h2>
          <p className="mt-2 text-xs text-[#1b1c1a]/60 font-sans leading-relaxed">{dict.sections.map_subtitle}</p>
        </header>

        {/* Quick Navigation */}
        <div className="px-8 py-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
           <Link href={`/${lang}`} className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#9e2016] hover:opacity-80 transition-opacity">
              <Home size={14} /> {lang === 'en' ? 'Back Home' : '返回首页'}
           </Link>
           <div className="flex gap-4">
              <Link href={`/${lang}/blog`} title={dict.nav.blog} className="text-[#1b1c1a]/40 hover:text-[#9e2016]"><BookOpen size={16} /></Link>
              <Link href={`/${lang}/lessons`} title={dict.nav.learn} className="text-[#1b1c1a]/40 hover:text-[#9e2016]"><GraduationCap size={16} /></Link>
           </div>
        </div>

        {/* Categories Filter */}
        <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50">
           {categories.map(cat => (
             <button 
               key={cat.id || 'all'}
               onClick={() => setActiveCategory(cat.id)}
               className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                 (activeCategory === cat.id || (cat.id === null && activeCategory === null))
                   ? 'bg-[#9e2016] text-white shadow-lg shadow-[#9e2016]/20'
                   : 'bg-white text-[#1b1c1a]/60 border border-gray-200 hover:border-[#9e2016]/30'
               }`}
             >
               {cat.label}
             </button>
           ))}
        </div>

        {/* Landmark List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 py-8 no-scrollbar bg-white">
          {filteredLandmarks.map(landmark => {
            const c = (landmark as any)[lang];
            return (
              <Link 
                key={landmark.id} 
                href={`/${lang}/landmarks/${landmark.id}`}
                className="block group relative p-6 bg-[#FAF8F5]/50 rounded-2xl border border-transparent hover:border-[#9e2016]/10 hover:bg-white hover:shadow-2xl hover:shadow-[#9e2016]/5 transition-all cursor-pointer"
              >
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#9e2016] py-1 px-3 bg-[#9e2016]/5 rounded-full">{landmark.category}</span>
                    <span className="text-[9px] font-sans font-bold text-[#1b1c1a]/30 uppercase tracking-widest">{landmark.province}</span>
                 </div>
                 <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-[#9e2016] transition-colors tracking-tight">{c.name}</h3>
                 <p className="text-[11px] text-[#1b1c1a]/60 font-sans line-clamp-2 leading-relaxed opacity-80">{c.shortDescription}</p>
                 
                 <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#9e2016] font-sans font-black text-[9px] uppercase tracking-[0.2em]">
                       {dict.btn.read_now} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center text-[8px] font-black text-gray-300">
                       {landmark.id.slice(0, 3).toUpperCase()}
                    </div>
                 </div>
              </Link>
            );
          })}
        </div>

        {/* Legal */}
        <div className="p-4 bg-gray-50 text-[8px] font-sans text-center uppercase tracking-widest opacity-30">
           ChinaVerse Geographic Data System v1.0 • GS(2024)001
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative bg-surface-container-lowest">
        <AmapView 
          landmarks={filteredLandmarks as any} 
          lang={lang} 
          onMapReady={(map) => { mapRef.current = map; }}
        />
        
        {/* Floating Controls */}
        <div className="absolute top-8 right-8 z-30 flex flex-col gap-4">
           <Link href={lang === 'en' ? '/zh/landmarks' : '/en/landmarks'} className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/20 hover:bg-[#9e2016] hover:text-white transition-all text-[#9e2016]">
              {lang === 'en' ? 'ZH | 中' : 'EN | EN'}
           </Link>
           
           <button 
             onClick={handleRecenter}
             className="w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-[#9e2016] hover:scale-110 active:scale-95 transition-all"
             title={lang === 'en' ? 'Re-center map' : '重新居中'}
           >
              <RotateCcw size={18} />
           </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20">
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#9e2016] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/60">{lang === 'en' ? 'Active Exploration Mode' : '活跃探索模式'}</span>
           </div>
        </div>
      </main>
    </div>
  );
}