import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Dashboard({ params }: PageProps) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${lang}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, posts:post_id(id, title_en, title_zh, cover_image_url, categories:category_id(name_en))')
    .eq('user_id', user.id)
    .limit(5);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badges:badge_id(id, name)')
    .eq('user_id', user.id);

  const { data: recentProgress } = await supabase
    .from('user_progress')
    .select('*, posts:post_id(id, title_en, title_zh)')
    .eq('user_id', user.id)
    .eq('content_type', 'blog')
    .order('last_accessed_at', { ascending: false })
    .limit(5);

  const isAdmin = profile?.role === 'admin';
  const isBlogger = profile?.role === 'blogger' || isAdmin;

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin';
    if (isBlogger) return 'Blogger';
    return 'Reader';
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1b1c1a] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      <header className="fixed top-0 w-full z-50 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#e1bfb9]/15">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-12">
            <Link href={`/${lang}`} className="text-2xl font-bold text-[#9e2016] italic tracking-tighter">
              ChinaVerse 中华宇宙
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link href={`/${lang}`} className="text-[#9e2016] font-bold border-b-2 border-[#9e2016] pb-1">
                Explore 探索
              </Link>
              <Link href={`/${lang}/blog`} className="text-[#1b1c1a]/60 font-medium hover:text-[#9e2016] transition-all duration-300">
                Blog 博客
              </Link>
              <Link href={`/${lang}/lessons`} className="text-[#1b1c1a]/60 font-medium hover:text-[#9e2016] transition-all duration-300">
                Learn 学习
              </Link>
              <Link href={`/${lang}/landmarks`} className="text-[#1b1c1a]/60 font-medium hover:text-[#9e2016] transition-all duration-300">
                Map 地图
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-[#59413d]">EN | 中</span>
            <div className="text-2xl cursor-pointer hover:scale-95 transition-transform text-[#9e2016]">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
        
          <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-xl flex flex-col items-center text-center shadow-[0_30px_60px_-15px_rgba(27,28,26,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-[#9bf6ba] text-[#0e7344] px-3 py-1 rounded-full text-xs font-bold">
                  {getRoleLabel()}
                </span>
              </div>
              
              <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#eae8e5]" cx="64" cy="64" fill="none" r="58" stroke="currentColor" strokeWidth="6" />
                  <circle className="text-[#9e2016]" cx="64" cy="64" fill="none" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="91.1" strokeWidth="6" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#f5f3f0] p-1 overflow-hidden">
                    <div className="w-full h-full bg-[#9e2016]/10 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#9e2016]">
                        {profile?.display_name?.[0] || profile?.username?.[0] || user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[#1b1c1a] mb-1">
                {profile?.display_name || profile?.username || user.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-[#59413d]/60 mb-6">
                Profile 75% Complete
              </p>
              
              <div className="w-full space-y-3">
                <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f5f3f0] text-[#9e2016] font-bold">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="text-sm">Dashboard 仪表板</span>
                </Link>
                <Link href={`/${lang}/bookmarks`} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#59413d] hover:bg-[#eae8e5] transition-colors">
                  <span className="material-symbols-outlined">bookmark</span>
                  <span className="text-sm">Bookmarks 书签</span>
                </Link>
                <Link href={`/${lang}/history`} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#59413d] hover:bg-[#eae8e5] transition-colors">
                  <span className="material-symbols-outlined">history</span>
                  <span className="text-sm">History 历史记录</span>
                </Link>
                <Link href={`/${lang}/settings`} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#59413d] hover:bg-[#eae8e5] transition-colors">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-sm">Settings 设置</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center py-8 opacity-20">
              <div className="h-24 w-px bg-[#1b1c1a] mb-4" />
              <p className="text-xl [writing-mode:vertical-rl] tracking-[0.5em] leading-loose">
                读书破万卷 下笔如有神
              </p>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-16">
            <section>
              <div className="flex justify-between items-baseline mb-8 border-b border-[#e1bfb9]/10 pb-4">
                <h3 className="text-4xl font-bold italic">
                  The Living Scroll 
                  <span className="text-2xl not-italic font-normal ml-2">学习历程</span>
                </h3>
                <span className="text-sm text-[#59413d]">Update: Today</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f5f3f0] p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-[#006d3f]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-widest text-[#59413d] font-bold">
                      Lessons Completed 课程
                    </span>
                    <span className="material-symbols-outlined text-[#006d3f]">auto_stories</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">{recentProgress?.filter(p => p.completed).length || 0}</span>
                      <span className="text-sm text-[#59413d]">/ {recentProgress?.length || 0}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#eae8e5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#006d3f]" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f3f0] p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-[#9e2016]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-widest text-[#59413d] font-bold">
                      Posts Read 阅读
                    </span>
                    <span className="material-symbols-outlined text-[#9e2016]">article</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">{recentProgress?.length || 0}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#eae8e5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#9e2016]" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f3f0] p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-[#694d00]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-widest text-[#59413d] font-bold">
                      Achievements 成就
                    </span>
                    <span className="material-symbols-outlined text-[#694d00]">workspace_premium</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">{userBadges?.length || 0}</span>
                      <span className="text-sm text-[#59413d]">Unlocks</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-full h-1 bg-[#694d00]/20 rounded-full" />
                      <div className="w-full h-1 bg-[#694d00]/20 rounded-full" />
                      <div className="w-full h-1 bg-[#694d00] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl font-bold">Bookmarked 书签</h3>
                <div className="h-px flex-1 bg-[#e1bfb9]/20" />
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                {bookmarks && bookmarks.length > 0 ? bookmarks.map((bookmark: any) => (
                  <Link 
                    key={bookmark.id} 
                    href={`/${lang}/blog/${bookmark.posts?.id}`}
                    className="snap-start min-w-[280px] group cursor-pointer flex-shrink-0"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                      {bookmark.posts?.cover_image_url ? (
                        <img 
                          src={bookmark.posts.cover_image_url} 
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-[#9e2016]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-[#9e2016]/40">image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-3 left-3 bg-[#9bf6ba] text-[#0e7344] px-2 py-0.5 rounded text-[10px] font-bold">
                        {bookmark.posts?.categories?.name_en || 'ARTICLE'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold leading-snug group-hover:text-[#9e2016] transition-colors">
                      {isEn ? bookmark.posts?.title_en : bookmark.posts?.title_zh}
                    </h4>
                  </Link>
                )) : (
                  <div className="snap-start min-w-[280px] flex-shrink-0">
                    <div className="h-40 rounded-xl bg-[#f5f3f0] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-4xl text-[#59413d]/40">bookmark_border</span>
                    </div>
                    <p className="text-sm text-[#59413d]">No bookmarks yet</p>
                  </div>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <section>
                <h3 className="text-3xl font-bold mb-8">Reading History 历史</h3>
                
                <div className="space-y-6">
                  {recentProgress && recentProgress.length > 0 ? recentProgress.map((progress: any) => (
                    <Link 
                      key={progress.id} 
                      href={`/${lang}/blog/${progress.posts?.id}`}
                      className="flex items-center gap-4 bg-white p-4 rounded-xl group cursor-pointer border-b border-[#e1bfb9]/10"
                    >
                      <div className="w-12 h-12 bg-[#c0392b]/20 rounded flex items-center justify-center text-[#9e2016]">
                        <span className="material-symbols-outlined">edit_note</span>
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-bold text-sm">
                          {isEn ? progress.posts?.title_en : progress.posts?.title_zh}
                        </h5>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-grow h-1 bg-[#eae8e5] rounded-full">
                            <div 
                              className={`h-full ${progress.completed ? 'bg-[#006d3f]' : 'bg-[#9e2016]'} rounded-full`} 
                              style={{ width: `${progress.progress_percent || 0}%` }} 
                            />
                          </div>
                          <span className="text-[10px] text-[#59413d]">
                            {progress.completed ? 'Done' : `${progress.progress_percent || 0}%`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border-b border-[#e1bfb9]/10">
                      <div className="w-12 h-12 bg-[#e4e2df] rounded flex items-center justify-center text-[#59413d]">
                        <span className="material-symbols-outlined">menu_book</span>
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-bold text-sm text-[#59413d]">Start reading to track progress</h5>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-3xl font-bold mb-8">Achievements 成就</h3>
                
                <div className="grid grid-cols-3 gap-6">
                  {userBadges && userBadges.length > 0 ? userBadges.slice(0, 6).map((badge: any, index: number) => (
                    <div key={badge.badge_id} className="flex flex-col items-center gap-2 group">
                      <div className={`w-20 h-20 ${index === 0 ? 'bg-[#c0392b]' : index === 1 ? 'bg-[#9bf6ba]' : 'bg-[#ffdfa0]'} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-4xl" style={{ 
                          color: index === 0 ? '#ffffff' : index === 1 ? '#0e7344' : '#694d00',
                          fontVariationSettings: "'FILL' 1"
                        }}>
                          {index === 0 ? 'brush' : index === 1 ? 'explore' : 'workspace_premium'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#9e2016]">{badge.badges?.name}</span>
                    </div>
                  )) : (
                    <>
                      <div className="flex flex-col items-center gap-2 group">
                        <div className="w-20 h-20 bg-[#c0392b] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#9e2016]">Ink Master</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 group">
                        <div className="w-20 h-20 bg-[#9bf6ba] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-4xl text-[#0e7344]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#006d3f]">Explorer</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 grayscale group">
                        <div className="w-20 h-20 bg-[#e4e2df] rounded-full flex items-center justify-center border-2 border-dashed border-[#8d706c] opacity-40">
                          <span className="material-symbols-outlined text-4xl text-[#59413d]">draw</span>
                        </div>
                        <span className="text-[10px] text-[#59413d]">Calligrapher</span>
                      </div>
                    </>
                  )}
                </div>
              </section>
            </div>

            {isAdmin && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-3xl font-bold">Admin Panel 管理面板</h3>
                  <div className="h-px flex-1 bg-[#e1bfb9]/20" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href={`/${lang}/admin/posts`} className="p-4 bg-[#efeeeb] hover:bg-[#9e2016] hover:text-white transition-all text-center rounded-xl">
                    <span className="material-symbols-outlined text-2xl block mb-2">article</span>
                    <span className="text-sm font-medium">Manage Posts</span>
                  </Link>
                  <Link href={`/${lang}/admin/users`} className="p-4 bg-[#efeeeb] hover:bg-[#9e2016] hover:text-white transition-all text-center rounded-xl">
                    <span className="material-symbols-outlined text-2xl block mb-2">group</span>
                    <span className="text-sm font-medium">Manage Users</span>
                  </Link>
                  <Link href={`/${lang}/admin/landmarks`} className="p-4 bg-[#efeeeb] hover:bg-[#9e2016] hover:text-white transition-all text-center rounded-xl">
                    <span className="material-symbols-outlined text-2xl block mb-2">location_on</span>
                    <span className="text-sm font-medium">Manage Landmarks</span>
                  </Link>
                  <Link href={`/${lang}/admin/lessons`} className="p-4 bg-[#efeeeb] hover:bg-[#9e2016] hover:text-white transition-all text-center rounded-xl">
                    <span className="material-symbols-outlined text-2xl block mb-2">school</span>
                    <span className="text-sm font-medium">Manage Lessons</span>
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#FAF8F5] w-full pt-16 pb-8 px-8 mt-12 border-t border-[#e1bfb9]/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="md:col-span-1">
            <h4 className="text-xl text-[#9e2016] mb-4">ChinaVerse 中华宇宙</h4>
            <p className="text-xs text-[#59413d]/60 leading-relaxed">
              A sanctuary for the preservation and exploration of cultural heritage through modern design and shared wisdom.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Discovery</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${lang}/landmarks`} className="text-[#1b1c1a]/60 hover:text-[#9e2016] transition-colors">Cultural Heritage 遗产</Link></li>
              <li><a href="https://bilibili.com" className="text-[#1b1c1a]/60 hover:text-[#9e2016] transition-colors">Bilibili 哔哩哔哩</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Support</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${lang}/settings`} className="text-[#1b1c1a]/60 hover:text-[#9e2016] transition-colors">Privacy 隐私</Link></li>
              <li><span className="text-[#1b1c1a]/60">Contact 联系</span></li>
            </ul>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] text-[#59413d]/40">
              © 2026 ChinaVerse 中华宇宙. The Living Scroll Experience.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
