import Link from 'next/link';
import { notFound } from 'next/navigation';
import content from '@/data/content.json';
import { getDictionary } from '@/lib/dictionary';
import { ChevronLeft, GraduationCap, Award, BookOpen } from 'lucide-react';
import LessonQuiz from '@/components/LessonQuiz';

export default async function LessonDetail({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang: langRaw, id } = await params;
  const lang = langRaw as 'en' | 'zh';
  const dict = await getDictionary(lang);
  
  const lesson = content.lessons.find((l: any) => l.id === id) as any;
  
  if (!lesson) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-32 px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b border-[#1b1c1a]/10 pb-8">
          <Link href={`/${lang}/lessons`} className="flex items-center gap-2 text-[#9e2016] font-sans text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity">
            <ChevronLeft size={16} /> {lang === 'en' ? 'Back to Curriculum' : '返回课程列表'}
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#1b1c1a]/5 flex items-center justify-center text-[#9e2016]">
                <GraduationCap size={16} />
             </div>
             <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/40">{lesson.category}</span>
          </div>
        </nav>

        {/* Content Header */}
        <div className="space-y-6 text-center">
           <h1 className="font-serif text-5xl md:text-7xl font-black text-[#1b1c1a] tracking-tight leading-tight">
             {lesson[lang].title}
           </h1>
           <div className="flex justify-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-[#9e2016]/5 text-[#9e2016] text-[10px] font-black uppercase tracking-widest">
                {lesson.difficulty}
              </span>
           </div>
        </div>

        {/* Key Takeaways Card */}
        <div className="bg-white rounded-[40px] p-10 md:p-16 border border-[#1b1c1a]/5 shadow-2xl shadow-black/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <Award size={160} />
           </div>
           
           <h3 className="font-serif text-3xl font-black mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-[#9e2016]/5 flex items-center justify-center text-[#9e2016]">
                <BookOpen size={20} />
              </span>
              {lang === 'en' ? 'Essence of Knowledge' : '核心要点'}
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lesson[lang].takeaways.map((takeaway: string, idx: number) => (
                 <div key={idx} className="flex gap-4 p-6 rounded-3xl bg-[#FAF8F5]/50 border border-transparent hover:border-[#9e2016]/10 transition-all group">
                    <span className="text-[10px] font-black font-sans text-[#9e2016]/30 group-hover:text-[#9e2016] transition-colors">{idx + 1}</span>
                    <p className="font-sans text-[#1b1c1a]/80 leading-relaxed text-sm italic">{takeaway}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Interactive Quiz Wrapper */}
        <div className="bg-[#1b1c1a] rounded-[40px] p-10 md:p-16 shadow-2xl shadow-black/30 text-white relative overflow-hidden">
           {/* Decorative patterns */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
           
           <div className="relative z-10 space-y-12">
              <div className="text-center space-y-4">
                 <h2 className="font-serif text-4xl font-black">{lang === 'en' ? 'Knowledge Mastery' : '知识测验'}</h2>
                 <p className="text-white/40 font-sans tracking-[0.2em] text-[10px] uppercase font-black">{lang === 'en' ? 'Level UP your Cultural IQ' : '提升您的文化商数'}</p>
              </div>

              {/* Client Component Quiz */}
              <LessonQuiz quiz={lesson[lang].quiz} lang={lang} />
           </div>
        </div>
      </div>
    </div>
  );
}
