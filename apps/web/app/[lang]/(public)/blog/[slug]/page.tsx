'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import content from '@/data/content.json';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Share2, Bookmark, Clock, User, Check } from 'lucide-react';

export default function BlogDetail() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const slug = (params?.slug as string) || '';
  
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  const post = content.posts.find((p: any) => p.slug === slug);
  
  if (!post) {
    return notFound();
  }

  const langKey = lang === 'en' ? 'en' : 'zh';
  const postContent = post[langKey] || post.en;

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postContent.title,
          url: window.location.href,
        });
      } catch {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <article className="min-h-screen bg-[#FAF8F5] selection:bg-[#9e2016]/20 selection:text-[#9e2016]">
      {/* Hero Section */}
      <header className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-2000 hover:scale-105" style={{ backgroundImage: `url(${post.image})` }}>
            <div className="w-full h-full bg-black/40 backdrop-blur-[2px]"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/20"></div>
        
        <nav className="absolute top-10 left-10 z-20">
          <Link href={`/${lang}/blog`} className="flex items-center gap-2 text-white/80 hover:text-white font-sans text-sm font-bold transition-all group">
            <span className="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-[#9e2016] group-hover:translate-x-[-4px] transition-all">
              <ChevronLeft size={16} />
            </span>
            {lang === 'en' ? 'BACK TO STORIES' : '返回故事列表'}
          </Link>
        </nav>

        <div className="absolute bottom-20 left-0 w-full z-20 px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-[#D4A017] text-[#1b1c1a] text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-widest bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full">
                <Clock size={12} />
                {post.readTime}
              </div>
            </div>
            <h1 className="font-serif text-5xl md:text-8xl font-black text-[#1b1c1a] tracking-tighter leading-tight drop-shadow-2xl">
              {postContent.title}
            </h1>
            <div className="flex items-center gap-6 pt-4 border-t border-[#1b1c1a]/10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9e2016] flex items-center justify-center text-white font-serif italic text-lg shadow-xl shadow-[#9e2016]/20">
                     {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#1b1c1a]/40 font-black uppercase tracking-widest">{lang === 'en' ? 'CURATED BY' : '策划者'}</p>
                    <p className="text-sm font-serif font-black text-[#1b1c1a]">{post.author}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-8 pb-32 relative z-30 -mt-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#1b1c1a]/5 p-8 md:p-20 relative border border-[#1b1c1a]/5">
           {/* Sidebar Actions */}
           <div className="absolute left-[-100px] top-20 hidden xl:flex flex-col gap-6">
              <button 
                onClick={handleBookmark}
                className={`w-12 h-12 rounded-full bg-white border flex items-center justify-center shadow-lg hover:shadow-[#9e2016]/10 hover:border-[#9e2016]/20 transition-all group ${bookmarked ? 'text-[#9e2016] border-[#9e2016]' : 'text-[#1b1c1a]/40 border-[#1b1c1a]/5'}`}
              >
                {bookmarked ? <Check size={20} /> : <Bookmark size={20} className="group-hover:fill-[#9e2016]/10 transition-colors" />}
              </button>
              <button 
                onClick={handleShare}
                className={`w-12 h-12 rounded-full bg-white border flex items-center justify-center shadow-lg hover:shadow-[#9e2016]/10 hover:border-[#9e2016]/20 transition-all ${shared ? 'text-green-500 border-green-500' : 'text-[#1b1c1a]/40 hover:text-[#9e2016]'}`}
              >
                {shared ? <Check size={20} /> : <Share2 size={20} />}
              </button>
           </div>

           <div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[#1b1c1a] prose-p:font-sans prose-p:text-[#1b1c1a]/80 prose-p:leading-relaxed prose-strong:text-[#9e2016] prose-table:border-[1px] prose-table:border-[#1b1c1a]/5 prose-th:bg-[#FAF8F5] prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {postContent.content}
             </ReactMarkdown>
           </div>
        </div>

        {/* Navigation Footer */}
        <footer className="mt-32 pt-20 border-t border-[#1b1c1a]/5 text-center space-y-12">
           <h3 className="font-serif text-3xl font-black opacity-30 italic">{lang === 'en' ? 'Keep Exploring' : '继续探索'}</h3>
           <div className="flex justify-center">
              <Link href={`/${lang}/blog`} className="bg-[#1b1c1a] text-white px-12 py-5 rounded-full font-serif font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4">
                 {lang === 'en' ? 'Back to Library' : '回到藏书阁'} <ChevronLeft size={20} className="rotate-180 opacity-40" />
              </Link>
           </div>
        </footer>
      </div>
    </article>
  );
}