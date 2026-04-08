import { getDictionary } from '@/lib/dictionary';
import content from '@/data/content.json';
import Link from 'next/link';
import { ChevronLeft, BookOpen, MapPin, GraduationCap, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');
  
  // Normalize ID (e.g. 'history' maps to 'History' in content.json)
  const categoryMap: { [key: string]: string } = {
    'history': 'History',
    'language': 'Language',
    'food': 'Food',
    'art': 'Art',
    'festivals': 'Festivals',
    'nature': 'Nature',
    'cityscape': 'Cityscape'
  };

  const categoryName = categoryMap[id.toLowerCase()];
  if (!categoryName) notFound();

  // Filter content
  const categoryPosts = content.posts.filter(p => p.category === categoryName);
  const categoryLandmarks = content.landmarks.filter(l => l.category === categoryName);
  const categoryLessons = content.lessons.filter(ls => ls.category === categoryName);

  const isEn = lang === 'en';
  const displayTitle = isEn ? categoryName : (dict.category as any)[id.toLowerCase()] || categoryName;

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-16">
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-[#1b1c1a]/40 hover:text-[#9e2016] transition-colors mb-8 text-xs font-sans font-black uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> {isEn ? 'Back to Home' : '返回首页'}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[#9e2016] font-sans font-black text-xs uppercase tracking-[0.4em]">Cultural Category</span>
              <h1 className="font-serif text-6xl md:text-8xl font-black text-[#1b1c1a] leading-none">
                {displayTitle}
              </h1>
            </div>
            <div className="max-w-md">
              <p className="text-lg text-[#1b1c1a]/60 font-sans leading-relaxed">
                {isEn 
                  ? `Explore the ${categoryName.toLowerCase()} heritage of China. Discover stories, landmarks, and lessons curated for global explorers.`
                  : `探索中国的${displayTitle}遗产。发现为全球探索者策划的故事、地标和课程。`}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Areas */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Blog Posts Section */}
            {categoryPosts.length > 0 && (
              <section id="stories" className="space-y-8">
                <div className="flex justify-between items-end border-b border-[#1b1c1a]/10 pb-6">
                  <h2 className="font-serif text-4xl font-black text-[#1b1c1a] flex items-center gap-4">
                    <BookOpen className="text-[#9e2016]" /> {isEn ? 'Cultural Stories' : '文化故事'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {categoryPosts.map(post => (
                    <Link 
                      key={post.slug} 
                      href={`/${lang}/blog/${post.slug}`}
                      className="group block space-y-4"
                    >
                      <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-[#1b1c1a]/5 relative">
                         <div className="absolute inset-0 bg-[#9e2016]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                         {/* Placeholder for now */}
                         <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-bold group-hover:text-[#9e2016] transition-colors">{(post as any)[lang].title}</h3>
                        <p className="text-sm text-[#1b1c1a]/60 font-sans line-clamp-2">{(post as any)[lang].excerpt}</p>
                        <div className="pt-2 flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-[#9e2016]">
                          {isEn ? 'Read Story' : '阅读故事'} <ArrowRight size={10} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Landmarks Section */}
            {categoryLandmarks.length > 0 && (
              <section id="landmarks" className="space-y-8">
                <div className="flex justify-between items-end border-b border-[#1b1c1a]/10 pb-6">
                  <h2 className="font-serif text-4xl font-black text-[#1b1c1a] flex items-center gap-4">
                    <MapPin className="text-[#9e2016]" /> {isEn ? 'Heritage Sites' : '文化遗产地'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {categoryLandmarks.map(landmark => (
                    <Link 
                      key={landmark.id} 
                      href={`/${lang}/landmarks/${landmark.id}`}
                      className="group flex flex-col md:flex-row gap-8 p-6 bg-white rounded-[32px] border border-[#1b1c1a]/5 hover:shadow-2xl hover:shadow-[#9e2016]/5 transition-all"
                    >
                      <div className="w-full md:w-48 aspect-square rounded-2xl bg-[#9e2016]/5 flex-shrink-0 flex items-center justify-center">
                         <MapPin className="text-[#9e2016]/20 w-12 h-12" />
                      </div>
                      <div className="flex-1 space-y-4 py-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-3xl font-black group-hover:text-[#9e2016] transition-colors">{(landmark as any)[lang].name}</h3>
                          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1b1c1a]/30">{landmark.province}</span>
                        </div>
                        <p className="text-base text-[#1b1c1a]/70 font-sans italic leading-relaxed">
                          "{(landmark as any)[lang].shortDescription}"
                        </p>
                        <div className="flex items-center gap-4">
                           <span className="bg-[#9e2016] text-white text-[10px] font-sans font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                             {isEn ? 'View Details' : '查看详情'}
                           </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Learning Center Widget */}
            <div className="bg-[#1b1c1a] text-white p-10 rounded-[40px] space-y-8 sticky top-32">
              <div className="space-y-2">
                <span className="text-[#9e2016] text-[10px] font-sans font-black uppercase tracking-[0.4em]">Interactive</span>
                <h2 className="font-serif text-3xl font-black">{isEn ? 'Knowledge Base' : '知识库'}</h2>
              </div>
              
              <div className="space-y-6">
                {categoryLessons.length > 0 ? (
                  categoryLessons.map(lesson => (
                    <Link 
                      key={lesson.id} 
                      href={`/${lang}/lessons/${lesson.id}`}
                      className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#9e2016] flex items-center justify-center shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-sm">{(lesson as any)[lang].title}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{(lesson as any).difficulty} • Quiz Included</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-10 text-white/20">
                    <p className="text-xs italic">{isEn ? 'Upcoming lessons for this category...' : '此分类的新课程即将推出...'}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link 
                  href={`/${lang}/lessons`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white text-[#1b1c1a] rounded-2xl font-sans font-black text-xs uppercase tracking-widest hover:bg-[#9e2016] hover:text-white transition-all shadow-xl"
                >
                  {isEn ? 'See All Lessons' : '查看所有课程'}
                </Link>
              </div>
            </div>

            {/* Quick Stats / Info Widget */}
            <div className="p-10 rounded-[40px] bg-white border border-[#1b1c1a]/5 space-y-6">
               <h4 className="font-serif text-xl font-black text-[#1b1c1a]">{isEn ? 'Archive Stats' : '档案统计'}</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl text-center">
                    <p className="text-2xl font-serif font-black text-[#9e2016]">{categoryPosts.length}</p>
                    <p className="text-[10px] font-sans font-black uppercase tracking-widest opacity-40">{isEn ? 'Stories' : '故事集'}</p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl text-center">
                    <p className="text-2xl font-serif font-black text-[#9e2016]">{categoryLandmarks.length}</p>
                    <p className="text-[10px] font-sans font-black uppercase tracking-widest opacity-40">{isEn ? 'Landmarks' : '地标'}</p>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
