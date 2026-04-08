'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryItem {
  id: string;
  name: string;
  nameZh: string;
  slug: string;
  bgClass: string;
}

interface CategoryGridProps {
  lang: string;
  dict: any;
}

export default function CategoryGrid({ lang, dict }: CategoryGridProps) {
  const isEn = lang === 'en';
  const categories: CategoryItem[] = [
    { id: 'history', name: dict.category.history, nameZh: '历史与地标', slug: 'history', bgClass: 'bg-[#C0392B]' },
    { id: 'language', name: dict.category.language, nameZh: '语言与书法', slug: 'language', bgClass: 'bg-[#C0392B]' },
    { id: 'food', name: dict.category.food, nameZh: '美食与传统', slug: 'food', bgClass: 'bg-[#C0392B]' },
    { id: 'art', name: dict.category.art, nameZh: '艺术与音乐', slug: 'art', bgClass: 'bg-[#C0392B]' },
    { id: 'festivals', name: dict.category.festivals, nameZh: '节日庆典', slug: 'festivals', bgClass: 'bg-[#1b1c1a]' },
    { id: 'nature', name: isEn ? 'Nature' : '自然风景', nameZh: '自然景观', slug: 'nature', bgClass: 'bg-[#27ae60]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Link href={`/${lang}/categories/history`} className="col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-xl h-80 md:h-auto bg-surface-variant transition-transform hover:scale-[1.02] active:scale-100 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
        {/* Background Overlay */}
        <div className="w-full h-full bg-[#9e2016]/10 group-hover:bg-[#9e2016]/20 transition-all duration-500"></div>
        <div className="absolute bottom-10 left-8 z-20 text-white">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-60 mb-2 block">Featured Collection</span>
          <h4 className="font-serif text-4xl font-black mb-2">{categories[0].name}</h4>
          <p className="text-sm opacity-80 font-sans">{categories[0].nameZh}</p>

          <div className="mt-6 flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-[#9e2016] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
             {isEn ? 'Explore History' : '探索历史'} →
          </div>
        </div>
      </Link>
      
      {categories.slice(1).map((cat, idx) => (
        <motion.div
           key={cat.id}
           whileHover={{ y: -5 }}
           className="relative group h-64"
        >
          <Link 
            href={`/${lang}/categories/${cat.slug}`} 
            className="block h-full relative group cursor-pointer overflow-hidden rounded-[32px] bg-white border border-[#1b1c1a]/5 p-8 flex flex-col justify-between hover:bg-[#9e2016] transition-all duration-500 hover:shadow-2xl hover:shadow-[#9e2016]/20"
          >
            <div className="space-y-2">
              <h4 className="font-serif text-2xl font-black group-hover:text-white transition-colors">{cat.name}</h4>
              <p className="text-[10px] font-sans font-black uppercase tracking-widest group-hover:text-white/40 transition-colors opacity-20">{cat.nameZh}</p>
            </div>
            
            <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-sans font-black uppercase tracking-widest text-white">Discover →</span>
               <div className="w-10 h-10 rounded-2xl border border-white/20 flex items-center justify-center text-white font-serif italic text-sm">
                  {idx + 1}
               </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
