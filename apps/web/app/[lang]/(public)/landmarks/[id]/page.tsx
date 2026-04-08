import { getDictionary } from '@/lib/dictionary';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import contentData from '@/data/content.json';
import { notFound } from 'next/navigation';

interface LandmarkPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function LandmarkDetailPage({ params }: LandmarkPageProps) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');
  
  const landmark = contentData.landmarks.find(l => l.id === id);
  if (!landmark) notFound();

  const c = lang === 'en' ? landmark.en : landmark.zh;
  const isEn = lang === 'en';

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Navigation / Breadcrumbs */}
        <nav className="mb-12 flex items-center justify-between">
          <Link 
            href={`/${lang}/landmarks`}
            className="group flex items-center gap-2 text-[#1b1c1a]/60 hover:text-[#9e2016] transition-colors"
          >
            <div className="p-2 rounded-full border border-[#1b1c1a]/10 group-hover:border-[#9e2016]/20 group-hover:bg-[#9e2016]/5 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-sans font-bold uppercase tracking-widest">
              {isEn ? 'Back to Map' : '返回地图'}
            </span>
          </Link>
          
          <div className="flex items-center gap-4 text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1b1c1a]/30">
            <span>{landmark.province}</span>
            <div className="w-1 h-1 rounded-full bg-[#1b1c1a]/20" />
            <span>{landmark.category}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-[40px] overflow-hidden aspect-[21/9] mb-16 shadow-2xl shadow-[#9e2016]/5 border border-[#1b1c1a]/5 group">
           <div className="absolute inset-0 bg-[#9e2016]/10 mix-blend-multiply opacity-20 group-hover:opacity-10 transition-opacity"></div>
           {/* Placeholder Image with dynamic overlay */}
           <div className="w-full h-full bg-gradient-to-br from-[#9e2016]/20 to-[#1b1c1a]/40 flex items-center justify-center relative">
              <div className="text-center text-white/40">
                 <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" />
                 <p className="text-xs font-sans uppercase tracking-[0.4em]">{c.name}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-10 left-10 right-10">
                 <h1 className="font-serif text-5xl md:text-7xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                   {c.name}
                 </h1>
                 <p className="text-white/80 font-sans max-w-2xl text-lg leadng-relaxed drop-shadow-md">
                   {c.shortDescription}
                 </p>
              </div>
           </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Article */}
          <div className="lg:col-span-8 space-y-12">
            <div className="prose prose-stone max-w-none 
              prose-headings:font-serif prose-headings:font-black prose-headings:text-[#1b1c1a]
              prose-p:font-sans prose-p:text-lg prose-p:text-[#1b1c1a]/80 prose-p:leading-relaxed
              prose-strong:text-[#9e2016] prose-strong:font-black
              prose-li:text-lg prose-li:text-[#1b1c1a]/80
              prose-hr:border-[#1b1c1a]/10
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {c.fullStory}
              </ReactMarkdown>
            </div>
            
            {/* CTA for further exploration */}
            <div className="pt-12 border-t border-[#1b1c1a]/5 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                 <h3 className="font-serif text-2xl font-black text-[#1b1c1a]">
                    {isEn ? 'Want to see more?' : '想了解更多？'}
                 </h3>
                 <p className="text-sm text-[#1b1c1a]/50 font-sans">
                    {isEn ? 'Discover related stories in our cultural blog.' : '在我们的文化博客中发现相关故事。'}
                 </p>
              </div>
              <Link 
                href={`/${lang}/blog`}
                className="bg-[#9e2016] text-white px-8 py-5 rounded-full font-serif font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#9e2016]/20 whitespace-nowrap"
              >
                {isEn ? 'Read Culture Blog' : '阅读文化博客'} <ArrowRight className="w-5 h-5 opacity-40" />
              </Link>
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Quick Info Card */}
            <div className="bg-white/50 backdrop-blur-md rounded-[32px] p-8 border border-white shadow-sm space-y-8 sticky top-32">
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center text-[#9e2016] shrink-0">
                        <MapPin className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 mb-1">Location</p>
                        <p className="text-sm font-sans font-bold text-[#1b1c1a]">{landmark.province}, China</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center text-[#9e2016] shrink-0">
                        <BookOpen className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 mb-1">Heritage Status</p>
                        <p className="text-sm font-sans font-bold text-[#1b1c1a]">UNESCO World Heritage</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#9e2016]/5 flex items-center justify-center text-[#9e2016] shrink-0">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 mb-1">Accessibility</p>
                        <p className="text-sm font-sans font-bold text-[#1b1c1a]">Open to Public</p>
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-[#1b1c1a]/5">
                  <button className="w-full bg-[#1b1c1a] text-white py-4 rounded-2xl font-sans font-bold text-sm tracking-widest uppercase hover:bg-[#9e2016] transition-colors flex items-center justify-center gap-2">
                     <ExternalLink className="w-4 h-4 opacity-40" />
                     {isEn ? 'Official Website' : '官方网站'}
                  </button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
