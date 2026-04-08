import Link from 'next/link';
import content from '@/data/content.json';
import { getDictionary } from '@/lib/dictionary';
import { cn } from '@/lib/utils';

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'zh');

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <h1 className="font-serif text-6xl font-black tracking-tighter uppercase">{dict.nav.blog}</h1>
          <p className="text-[#1b1c1a]/60 font-sans max-w-2xl text-lg italic">
            {lang === 'en' ? "Exploring the depth of Chinese heritage through modern storytelling." : "通过现代叙事探索中国传统文化的深厚底蕴。"}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {content.posts.map((post: any) => (
            <Link 
              key={post.slug} 
              href={`/${lang}/blog/${post.slug}`}
              className="group flex flex-col space-y-6"
            >
              <div className="aspect-video overflow-hidden rounded-3xl bg-gray-100 relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${post.image})` }}
                >
                  <div className="w-full h-full bg-[#9e2016]/5 flex items-center justify-center">
                    <span className="text-8xl font-serif text-[#9e2016]/5 font-black">{post.category.charAt(0)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#9e2016]/5 text-[#9e2016] text-[10px] font-black uppercase tracking-widest">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-[#1b1c1a]/30 font-black uppercase tracking-widest">{post.readTime}</span>
                </div>
                <h2 className="font-serif text-2xl font-black group-hover:text-[#9e2016] transition-colors leading-snug">
                  {post[lang].title}
                </h2>
                <p className="text-sm text-[#1b1c1a]/60 line-clamp-2 leading-relaxed">
                  {post[lang].excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
