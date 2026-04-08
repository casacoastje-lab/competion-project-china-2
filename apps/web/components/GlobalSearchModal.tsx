'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, BookOpen, GraduationCap, X, ArrowRight, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import content from '../data/content.json';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchModalProps {
  lang: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ lang, isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    landmarks: any[];
    posts: any[];
    lessons: any[];
  }>({ landmarks: [], posts: [], lessons: [] });
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const isEn = lang === 'en';

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ landmarks: [], posts: [], lessons: [] });
      return;
    }

    const q = query.toLowerCase();
    
    const filteredLandmarks = content.landmarks.filter(l => 
      (l as any)[lang].name.toLowerCase().includes(q) || 
      l.province.toLowerCase().includes(q)
    ).slice(0, 4);

    const filteredPosts = content.posts.filter(p => 
      (p as any)[lang].title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    const filteredLessons = content.lessons.filter(ls => 
      (ls as any)[lang].title.toLowerCase().includes(q)
    ).slice(0, 4);

    setResults({
      landmarks: filteredLandmarks,
      posts: filteredPosts,
      lessons: filteredLessons
    });
  }, [query, lang]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/${lang}/landmarks?search=${encodeURIComponent(query)}`);
  };

  const hasResults = results.landmarks.length > 0 || results.posts.length > 0 || results.lessons.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#FAF8F5]/98 backdrop-blur-2xl flex flex-col pt-32 px-6"
        >
          <div className="max-w-4xl mx-auto w-full space-y-12">
            {/* Search Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1b1c1a]/5 pb-8">
               <div className="flex-1 relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9e2016] w-8 h-8 opacity-40" />
                  <form onSubmit={handleSearch}>
                    <input 
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={isEn ? "Search the Imperial archives..." : "搜索帝国档案..."}
                      className="w-full bg-transparent border-none text-4xl font-serif font-black text-[#1b1c1a] pl-14 focus:ring-0 outline-none placeholder:text-[#1b1c1a]/10"
                    />
                  </form>
               </div>
               <button 
                onClick={onClose}
                className="w-14 h-14 bg-[#1b1c1a] text-white rounded-full flex items-center justify-center hover:bg-[#9e2016] transition-all shadow-xl shadow-[#1b1c1a]/20"
               >
                  <X size={24} />
               </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
               {query.length < 2 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016]">
                           {isEn ? 'Archival Shortcuts' : '档案快捷方式'}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                           {['History', 'Architecture', 'Art', 'Nature'].map(cat => (
                             <button 
                              key={cat}
                              onClick={() => { setQuery(cat); }}
                              className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white border border-transparent hover:border-[#1b1c1a]/5 transition-all group"
                             >
                                <History size={16} className="text-[#1b1c1a]/20 group-hover:text-[#9e2016]" />
                                <span className="font-serif font-bold text-[#1b1c1a]">{cat}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="p-8 bg-white rounded-[40px] border border-[#1b1c1a]/5 space-y-4">
                        <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016]">
                           {isEn ? 'Explorer Tip' : '探索者提示'}
                        </p>
                        <p className="text-sm font-serif leading-relaxed text-[#1b1c1a]/60">
                           {isEn 
                             ? "Search for provinces, landmark names, or cultural categories to reveal hidden chronicles from the ChinaVerse archives."
                             : "搜索省份、地标名称或文化类别，揭示中华宇宙档案中隐藏的纪事。"}
                        </p>
                     </div>
                  </div>
               ) : !hasResults ? (
                  <div className="py-20 text-center space-y-6">
                     <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-[#1b1c1a]/5 border border-[#1b1c1a]/5">
                        <Search size={40} />
                     </div>
                     <p className="text-xl font-serif italic text-[#1b1c1a]/30">
                        {isEn ? 'No chronicles matching your query...' : '没有匹配的纪事...'}
                     </p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     {/* Section Template */}
                     {[
                        { title: isEn ? 'Relics' : '遗迹', items: results.landmarks, icon: MapPin, href: 'landmarks' },
                        { title: isEn ? 'Stories' : '故事', items: results.posts, icon: BookOpen, href: 'blog' },
                        { title: isEn ? 'Arts' : '艺术', items: results.lessons, icon: GraduationCap, href: 'lessons' }
                     ].map(section => section.items.length > 0 && (
                        <div key={section.title} className="space-y-6">
                           <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016]">
                              {section.title}
                           </h4>
                           <div className="space-y-4">
                              {section.items.map((item: any) => (
                                 <Link 
                                    key={item.id || item.slug}
                                    href={`/${lang}/${section.href}/${item.slug || item.id}`}
                                    onClick={onClose}
                                    className="block p-5 bg-white rounded-3xl border border-transparent hover:border-[#9e2016]/20 hover:shadow-xl transition-all group"
                                 >
                                    <div className="flex items-start gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center text-[#9e2016]/40 group-hover:bg-[#9e2016] group-hover:text-white transition-all">
                                          <section.icon size={18} />
                                       </div>
                                       <div>
                                          <p className="font-serif font-bold text-[#1b1c1a] leading-tight">
                                             {item[lang].name || item[lang].title}
                                          </p>
                                          <p className="text-[9px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 mt-1">
                                             {item.province || item.category}
                                          </p>
                                       </div>
                                    </div>
                                 </Link>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
