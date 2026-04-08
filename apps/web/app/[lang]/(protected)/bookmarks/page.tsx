import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/dictionary';

export default async function Bookmarks({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect(`/${lang}/login`);
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      *,
      posts:post_id (
        id,
        title_en,
        title_zh,
        excerpt_en,
        excerpt_zh,
        slug,
        cover_image_url,
        category:category_id (name_en, name_zh),
        author:author_id (username, display_name)
      )
    `)
    .eq('user_id', user.id);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] pt-32 pb-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9e2016]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
          <Link href={`/${lang}/dashboard`} className="inline-flex items-center gap-2 text-sm text-[#1b1c1a]/40 hover:text-[#9e2016] transition-colors mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            {isEn ? 'Back to Dashboard' : '返回仪表板'}
          </Link>
          <h1 className="font-serif text-5xl font-black text-[#1b1c1a] tracking-tight">
            {isEn ? 'Private Library' : '私人馆藏'}
          </h1>
          <p className="text-[#1b1c1a]/60 mt-2">
            {isEn ? 'Your saved articles and content' : '您收藏的文章和内容'}
          </p>
        </header>

        {bookmarks && bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookmarks.map((bookmark: any) => (
              <Link 
                key={bookmark.id}
                href={`/${lang}/blog/${bookmark.posts?.slug}`}
                className="bg-white rounded-[32px] p-8 border border-[#1b1c1a]/5 hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                {bookmark.posts?.cover_image_url && (
                  <div className="w-full h-48 rounded-2xl bg-[#FAF8F5] mb-6 overflow-hidden">
                    <img 
                      src={bookmark.posts.cover_image_url} 
                      alt={isEn ? bookmark.posts.title_en : bookmark.posts.title_zh}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <span className="inline-flex items-center px-3 py-1 bg-[#9e2016]/5 text-[#9e2016] text-xs font-black uppercase tracking-widest rounded-full">
                    {isEn ? bookmark.posts?.category?.name_en : bookmark.posts?.category?.name_zh}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-[#1b1c1a] group-hover:text-[#9e2016] transition-colors">
                    {isEn ? bookmark.posts?.title_en : bookmark.posts?.title_zh}
                  </h3>
                  <p className="text-sm text-[#1b1c1a]/60 line-clamp-2">
                    {isEn ? bookmark.posts?.excerpt_en : bookmark.posts?.excerpt_zh}
                  </p>
                  <p className="text-xs text-[#1b1c1a]/40 font-sans">
                    {isEn ? `By ${bookmark.posts?.author?.display_name || bookmark.posts?.author?.username}` : `作者：${bookmark.posts?.author?.display_name || bookmark.posts?.author?.username}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[48px] border border-[#1b1c1a]/5">
            <div className="w-24 h-24 bg-[#9e2016]/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9e2016]/40"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </div>
            <h2 className="font-serif text-3xl font-black text-[#1b1c1a] mb-4">
              {isEn ? 'No bookmarks yet' : '暂无收藏'}
            </h2>
            <p className="text-[#1b1c1a]/60 mb-8">
              {isEn ? 'Start exploring and save articles you like.' : '开始探索并收藏您喜欢的文章。'}
            </p>
            <Link 
              href={`/${lang}/blog`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#9e2016] text-white rounded-full font-sans font-black text-sm hover:bg-[#C0392B] transition-colors"
            >
              {isEn ? 'Explore Blog' : '探索博客'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
