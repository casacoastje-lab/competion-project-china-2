'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, BookOpen, GraduationCap, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import content from '../data/content.json';
import Link from 'next/link';

interface HeroSearchProps {
  lang: string;
  placeholder: string;
}

export default function HeroSearch({ lang, placeholder }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    landmarks: any[];
    posts: any[];
    lessons: any[];
  }>({ landmarks: [], posts: [], lessons: [] });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isEn = lang === 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ landmarks: [], posts: [], lessons: [] });
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    
    const filteredLandmarks = content.landmarks.filter(l => 
      (l as any)[lang].name.toLowerCase().includes(q) || 
      l.province.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredPosts = content.posts.filter(p => 
      (p as any)[lang].title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredLessons = content.lessons.filter(ls => 
      (ls as any)[lang].title.toLowerCase().includes(q)
    ).slice(0, 3);

    setResults({
      landmarks: filteredLandmarks,
      posts: filteredPosts,
      lessons: filteredLessons
    });
    setIsOpen(true);
  }, [query, lang]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/${lang}/landmarks?search=${encodeURIComponent(query)}`);
  };

  const hasResults = results.landmarks.length > 0 || results.posts.length > 0 || results.lessons.length > 0;

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto group z-50">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            className="w-full bg-white/95 backdrop-blur-xl border border-[#9e2016]/10 px-10 py-6 rounded-[32px] text-lg shadow-2xl shadow-[#1b1c1a]/10 focus:ring-4 focus:ring-[#9e2016]/5 transition-all outline-none pl-16 pr-32 placeholder:text-[#1b1c1a]/30 font-sans" 
            placeholder={placeholder} 
          />
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[#9e2016] w-6 h-6 opacity-40 group-focus-within:opacity-100 transition-opacity" />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
               <button 
                type="button"
                onClick={() => setQuery('')}
                className="p-2 hover:bg-[#1b1c1a]/5 rounded-full transition-colors"
               >
                 <X size={16} className="text-[#1b1c1a]/40" />
               </button>
            )}
            <button 
              type="submit"
              className="bg-[#9e2016] text-white px-6 py-3 rounded-2xl font-sans font-black text-xs uppercase tracking-widest hover:bg-[#C0392B] active:scale-95 transition-all shadow-lg shadow-[#9e2016]/20"
            >
              {isEn ? 'Find' : '搜索'}
            </button>
          </div>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-[#1b1c1a]/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-h-[70vh] overflow-y-auto p-8 no-scrollbar">
            {!hasResults ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto text-[#1b1c1a]/10">
                   <Search size={32} />
                </div>
                <p className="text-[#1b1c1a]/40 font-sans italic">
                  {isEn ? 'No cultural archives found for this query...' : '未找到相关文化档案...'}
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Landmarks Section */}
                {results.landmarks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016] border-b border-[#1b1c1a]/5 pb-2">
                      {isEn ? 'Heritage Sites' : '文化遗产地'}
                    </h3>
                    <div className="space-y-2">
                      {results.landmarks.map(l => (
                        <Link 
                          key={l.id} 
                          href={`/${lang}/landmarks/${l.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#FAF8F5] transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center">
                              <MapPin size={18} className="text-[#9e2016]/40" />
                            </div>
                            <div>
                              <p className="font-serif font-black text-[#1b1c1a]">{(l as any)[lang].name}</p>
                              <p className="text-[10px] text-[#1b1c1a]/40 font-sans uppercase tracking-widest">{l.province}</p>
                            </div>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#9e2016]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Section */}
                {results.posts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016] border-b border-[#1b1c1a]/5 pb-2">
                      {isEn ? 'Cultural Stories' : '文化故事'}
                    </h3>
                    <div className="space-y-2">
                      {results.posts.map(p => (
                        <Link 
                          key={p.slug} 
                          href={`/${lang}/blog/${p.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#FAF8F5] transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center">
                              <BookOpen size={18} className="text-[#9e2016]/40" />
                            </div>
                            <div>
                              <p className="font-serif font-black text-[#1b1c1a]">{(p as any)[lang].title}</p>
                              <p className="text-[10px] text-[#1b1c1a]/40 font-sans uppercase tracking-widest">{p.category}</p>
                            </div>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#9e2016]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lessons Section */}
                {results.lessons.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016] border-b border-[#1b1c1a]/5 pb-2">
                      {isEn ? 'Interactive Learning' : '互动学习'}
                    </h3>
                    <div className="space-y-2">
                      {results.lessons.map(ls => (
                        <Link 
                          key={ls.id} 
                          href={`/${lang}/lessons/${ls.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#FAF8F5] transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center">
                              <GraduationCap size={18} className="text-[#9e2016]/40" />
                            </div>
                            <div>
                              <p className="font-serif font-black text-[#1b1c1a]">{(ls as any)[lang].title}</p>
                              <p className="text-[10px] text-[#1b1c1a]/40 font-sans uppercase tracking-widest">{ls.category}</p>
                            </div>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#9e2016]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-[#1b1c1a] p-4 text-center">
             <button 
              onClick={handleSearch}
              className="text-[10px] text-white/40 font-sans font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
             >
                {isEn ? 'Press Enter for all heritage results' : '按回车查看所有文化遗产结果'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
