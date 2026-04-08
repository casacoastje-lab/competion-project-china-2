import Link from 'next/link';
import content from '@/data/content.json';
import { getDictionary } from '@/lib/dictionary';
import { GraduationCap, Award, BookOpen, Clock } from 'lucide-react';

export default async function LessonsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center space-y-6">
          <div className="flex justify-center mb-4">
             <div className="p-4 rounded-full bg-[#9e2016]/5 text-[#9e2016]">
                <GraduationCap size={40} />
             </div>
          </div>
          <h1 className="font-serif text-6xl font-black tracking-tighter uppercase">{dict.nav.learn}</h1>
          <p className="text-[#1b1c1a]/60 font-sans max-w-2xl mx-auto text-lg italic">
            {lang === 'en' ? "Bite-sized interactive lessons to master the essence of Chinese culture." : "微型互动课程，助您掌握中华文化的精髓。"}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.lessons.map((lesson: any) => (
            <Link 
              key={lesson.id} 
              href={`/${lang}/lessons/${lesson.id}`}
              className="group bg-white rounded-[40px] p-10 border border-[#1b1c1a]/5 hover:border-[#9e2016]/20 hover:shadow-2xl hover:shadow-[#9e2016]/5 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                 <Award size={120} />
              </div>
              
              <div className="flex flex-col h-full space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <span className="px-4 py-1.5 rounded-full bg-[#FAF8F5] text-[#9e2016] text-[10px] font-black uppercase tracking-widest border border-[#9e2016]/10">
                    {lesson.category}
                  </span>
                  <span className="text-[10px] text-[#1b1c1a]/30 font-black uppercase tracking-widest flex items-center gap-2">
                     <Clock size={12} /> {lesson.difficulty}
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl font-black group-hover:text-[#9e2016] transition-colors leading-tight">
                  {lesson[lang].title}
                </h2>
                
                <ul className="space-y-4 pt-4 border-t border-gray-50 flex-1">
                   {lesson[lang].takeaways.map((takeaway: string, idx: number) => (
                     <li key={idx} className="flex items-start gap-3 text-sm text-[#1b1c1a]/60 font-sans italic leading-relaxed">
                        <span className="text-[#9e2016] mt-1 opacity-40">•</span>
                        {takeaway}
                     </li>
                   ))}
                </ul>

                <div className="pt-8">
                  <div className="bg-[#1b1c1a] text-white py-4 px-8 rounded-full text-center font-serif font-black flex items-center justify-center gap-3 group-hover:bg-[#9e2016] transition-colors shadow-xl shadow-black/10">
                    {dict.btn.start_learning} <span className="text-xl rotate-[-45deg] group-hover:rotate-0 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
