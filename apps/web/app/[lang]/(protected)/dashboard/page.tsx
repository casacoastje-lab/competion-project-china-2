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
    .select('*, posts:post_id(id, title_en, title_zh, cover_image_url, category_id, categories:category_id(name_en))')
    .eq('user_id', user.id)
    .limit(5);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badges:badge_id(id, name, icon_url)')
    .eq('user_id', user.id);

  const { data: recentProgress } = await supabase
    .from('user_progress')
    .select('*, posts:post_id(title_en, title_zh)')
    .eq('user_id', user.id)
    .eq('content_type', 'blog')
    .order('last_accessed_at', { ascending: false })
    .limit(5);

  const isAdmin = profile?.role === 'admin';
  const isBlogger = profile?.role === 'blogger' || isAdmin;

  const getRoleLabel = () => {
    if (isAdmin) return isEn ? 'Admin' : '管理员';
    if (isBlogger) return isEn ? 'Blogger' : '博主';
    return isEn ? 'Reader' : '读者';
  };

  const lessonsCompleted = 24;
  const totalLessons = 30;
  const postsRead = 142;
  const achievementsUnlocked = userBadges?.length || 0;

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-x-hidden">
      <div className="fixed inset-0 rice-paper-grain z-0" />
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-12">
            <Link href={`/${lang}`} className="text-2xl font-serif font-bold text-primary tracking-tighter italic">
              ChinaVerse 中华宇宙
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link href={`/${lang}`} className="text-primary font-bold border-b-2 border-primary pb-1">
                {isEn ? 'Explore' : '探索'}
              </Link>
              <Link href={`/${lang}/blog`} className="text-on-surface/60 font-medium hover:text-primary transition-all duration-300">
                {isEn ? 'Blog' : '博客'}
              </Link>
              <Link href={`/${lang}/lessons`} className="text-on-surface/60 font-medium hover:text-primary transition-all duration-300">
                {isEn ? 'Learn' : '学习'}
              </Link>
              <Link href={`/${lang}/landmarks`} className="text-on-surface/60 font-medium hover:text-primary transition-all duration-300">
                {isEn ? 'Map' : '地图'}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-label text-on-surface-variant">EN | 中</span>
            <Link href={`/${lang}/dashboard`} className="text-2xl cursor-pointer hover:scale-95 transition-transform text-primary">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
        <div className="h-px w-full bg-outline-variant/15" />
      </header>

      <main className="relative z-10 pt-24 pb-16 px-8 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Sidebar: Profile & Nav */}
        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-8">
          {/* Profile Summary Card */}
          <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col items-center text-center shadow-[0_30px_60px_-15px_rgba(27,28,26,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-label font-bold">
                {getRoleLabel()}
              </span>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="6" />
                <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="91.1" strokeWidth="6" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-surface-container-low p-1 overflow-hidden">
                  <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {profile?.display_name?.[0] || profile?.username?.[0] || user.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-on-surface">
              {profile?.display_name || profile?.username || user.email?.split('@')[0]}
            </h2>
            <p className="text-sm font-label text-on-surface-variant/60 mb-6">
              {isEn ? 'Profile 75% Complete' : '资料完成 75%'}
            </p>
            
            <div className="w-full space-y-3">
              <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container-low text-primary font-bold">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-sm">{isEn ? 'Dashboard' : '仪表板'}</span>
              </Link>
              <Link href={`/${lang}/bookmarks`} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">bookmark</span>
                <span className="text-sm">{isEn ? 'Bookmarks' : '书签'}</span>
              </Link>
              <Link href={`/${lang}/history`} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">history</span>
                <span className="text-sm">{isEn ? 'History' : '历史记录'}</span>
              </Link>
              <Link href={`/${lang}/settings`} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm">{isEn ? 'Settings' : '设置'}</span>
              </Link>
            </div>
          </div>

          {/* Vertical Decorative Quote */}
          <div className="hidden md:flex flex-col items-center py-8 opacity-20">
            <div className="h-24 w-px bg-on-surface mb-4" />
            <p className="font-serif text-xl [writing-mode:vertical-rl] tracking-[0.5em] leading-loose">
              读书破万卷 下笔如有神
            </p>
          </div>
        </aside>

        {/* Dashboard Content Canvas */}
        <div className="flex-grow flex flex-col gap-16">
          
          {/* Section 1: Progress Overview Bento */}
          <section>
            <div className="flex justify-between items-baseline mb-8 border-b border-outline-variant/10 pb-4">
              <h3 className="font-serif text-4xl font-black italic">
                {isEn ? 'The Living Scroll' : '活着的画卷'} 
                <span className="text-2xl not-italic font-normal ml-2">{isEn ? 'Learning Journey' : '学习历程'}</span>
              </h3>
              <span className="font-label text-sm text-on-surface-variant">{isEn ? 'Update: Today' : '更新：今天'}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lessons Completed */}
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-secondary">
                <div className="flex justify-between items-start">
                  <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    {isEn ? 'Lessons Completed' : '课程完成'} {isEn ? '课程' : ''}
                  </span>
                  <span className="material-symbols-outlined text-secondary">auto_stories</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-serif font-bold">{lessonsCompleted}</span>
                    <span className="text-sm text-on-surface-variant">/ {totalLessons}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[80%]" />
                  </div>
                </div>
              </div>

              {/* Posts Read */}
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-primary">
                <div className="flex justify-between items-start">
                  <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    {isEn ? 'Posts Read' : '已读文章'} {isEn ? '阅读' : ''}
                  </span>
                  <span className="material-symbols-outlined text-primary">article</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-serif font-bold">{postsRead}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-tertiary">
                <div className="flex justify-between items-start">
                  <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    {isEn ? 'Achievements' : '成就'} {isEn ? '成就' : ''}
                  </span>
                  <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-serif font-bold">{achievementsUnlocked}</span>
                    <span className="text-sm text-on-surface-variant">{isEn ? 'Unlocks' : '解锁'}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-full h-1 bg-tertiary/20 rounded-full" />
                    <div className="w-full h-1 bg-tertiary/20 rounded-full" />
                    <div className="w-full h-1 bg-tertiary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Bookmarked Posts (Horizontal Scroll) */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="font-serif text-3xl font-bold">{isEn ? 'Bookmarked' : '书签'}</h3>
              <div className="h-px flex-grow bg-outline-variant/20" />
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
              {bookmarks && bookmarks.length > 0 ? (
                bookmarks.map((bookmark: any) => (
                  <Link 
                    key={bookmark.id} 
                    href={`/${lang}/blog/${bookmark.posts?.id}`}
                    className="snap-start min-w-[280px] group cursor-pointer"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                      {bookmark.posts?.cover_image_url ? (
                        <img 
                          src={bookmark.posts.cover_image_url} 
                          alt={isEn ? bookmark.posts.title_en : bookmark.posts.title_zh}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-primary/40">image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-3 left-3 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-label font-bold">
                        {bookmark.posts?.categories?.name_en || 'ARTICLE'}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                      {isEn ? bookmark.posts?.title_en : bookmark.posts?.title_zh}
                    </h4>
                  </Link>
                ))
              ) : (
                <div className="snap-start min-w-[280px]">
                  <div className="h-40 rounded-xl bg-surface-container-low flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">bookmark_border</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{isEn ? 'No bookmarks yet' : '暂无书签'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Section 3 & 4 Grid: Reading History & Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Reading History */}
            <section>
              <h3 className="font-serif text-3xl font-bold mb-8">
                {isEn ? 'Reading History' : '阅读历史'}
              </h3>
              
              <div className="space-y-6">
                {recentProgress && recentProgress.length > 0 ? (
                  recentProgress.map((progress: any) => (
                    <Link 
                      key={progress.id} 
                      href={`/${lang}/blog/${progress.posts?.id}`}
                      className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl group cursor-pointer border-b border-outline-variant/10"
                    >
                      <div className="w-12 h-12 bg-primary-container/20 rounded flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">edit_note</span>
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-bold text-sm">
                          {isEn ? progress.posts?.title_en : progress.posts?.title_zh}
                        </h5>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-grow h-1 bg-surface-container-high rounded-full">
                            <div className={`h-full ${progress.completed ? 'bg-secondary' : 'bg-primary'} rounded-full`} style={{ width: `${progress.progress_percent}%` }} />
                          </div>
                          <span className="text-[10px] font-label text-on-surface-variant">
                            {progress.completed ? (isEn ? 'Done' : '完成') : `${progress.progress_percent}%`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border-b border-outline-variant/10">
                    <div className="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-bold text-sm text-on-surface-variant">{isEn ? 'Start reading to track progress' : '开始阅读以跟踪进度'}</h5>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Achievement Badges */}
            <section>
              <h3 className="font-serif text-3xl font-bold mb-8">
                {isEn ? 'Achievements' : '成就'}
              </h3>
              
              <div className="grid grid-cols-3 gap-6">
                {userBadges && userBadges.length > 0 ? (
                  userBadges.slice(0, 6).map((badge: any, index: number) => (
                    <div key={badge.badge_id} className="flex flex-col items-center gap-2 group">
                      <div className={`w-20 h-20 ${index === 0 ? 'bg-primary-container' : index === 1 ? 'bg-secondary-container' : 'bg-tertiary-fixed'} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-4xl" style={{ 
                          color: index === 0 ? '#ffe5e1' : index === 1 ? '#0e7344' : '#694d00',
                          fontVariationSettings: "'FILL' 1"
                        }}>
                          {index === 0 ? 'brush' : index === 1 ? 'explore' : 'workspace_premium'}
                        </span>
                      </div>
                      <span className="text-[10px] font-label font-bold text-primary">{badge.badges?.name}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                      </div>
                      <span className="text-[10px] font-label font-bold text-primary">{isEn ? 'Ink Master' : '墨艺大师'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                      </div>
                      <span className="text-[10px] font-label font-bold text-secondary">{isEn ? 'Explorer' : '探索者'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 grayscale group">
                      <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center border-2 border-dashed border-outline-variant opacity-40">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">draw</span>
                      </div>
                      <span className="text-[10px] font-label font-medium text-on-surface-variant">{isEn ? 'Calligrapher' : '书法家'}</span>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Admin Panel */}
          {isAdmin && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-serif text-3xl font-bold">{isEn ? 'Admin Panel' : '管理面板'}</h3>
                <div className="h-px flex-grow bg-outline-variant/20" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href={`/${lang}/admin/posts`} className="p-4 bg-surface-container hover:bg-primary hover:text-white transition-all text-center rounded-xl">
                  <span className="material-symbols-outlined text-2xl block mb-2">article</span>
                  <span className="text-sm font-medium">{isEn ? 'Manage Posts' : '管理文章'}</span>
                </Link>
                <Link href={`/${lang}/admin/users`} className="p-4 bg-surface-container hover:bg-primary hover:text-white transition-all text-center rounded-xl">
                  <span className="material-symbols-outlined text-2xl block mb-2">group</span>
                  <span className="text-sm font-medium">{isEn ? 'Manage Users' : '管理用户'}</span>
                </Link>
                <Link href={`/${lang}/admin/landmarks`} className="p-4 bg-surface-container hover:bg-primary hover:text-white transition-all text-center rounded-xl">
                  <span className="material-symbols-outlined text-2xl block mb-2">location_on</span>
                  <span className="text-sm font-medium">{isEn ? 'Manage Landmarks' : '管理地标'}</span>
                </Link>
                <Link href={`/${lang}/admin/lessons`} className="p-4 bg-surface-container hover:bg-primary hover:text-white transition-all text-center rounded-xl">
                  <span className="material-symbols-outlined text-2xl block mb-2">school</span>
                  <span className="text-sm font-medium">{isEn ? 'Manage Lessons' : '管理课程'}</span>
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background w-full pt-16 pb-8 px-8 mt-12 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="md:col-span-1">
            <h4 className="text-xl font-serif text-primary mb-4">ChinaVerse 中华宇宙</h4>
            <p className="text-xs text-on-surface-variant/60 font-label leading-relaxed">
              {isEn 
                ? 'A sanctuary for the preservation and exploration of cultural heritage through modern design and shared wisdom.'
                : '通过现代设计和共享智慧保护与探索文化遗产的圣地。'}
            </p>
          </div>
          <div>
            <h5 className="font-label text-xs font-bold uppercase tracking-widest mb-4 opacity-50">{isEn ? 'Discovery' : '发现'}</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${lang}/landmarks`} className="text-on-surface/60 hover:text-primary transition-colors">{isEn ? 'Cultural Heritage' : '文化遗产'}</Link></li>
              <li><a href="https://bilibili.com" className="text-on-surface/60 hover:text-primary transition-colors">Bilibili 哔哩哔哩</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label text-xs font-bold uppercase tracking-widest mb-4 opacity-50">{isEn ? 'Support' : '支持'}</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${lang}/settings`} className="text-on-surface/60 hover:text-primary transition-colors">{isEn ? 'Privacy' : '隐私'}</Link></li>
              <li><span className="text-on-surface/60">{isEn ? 'Contact' : '联系'}</span></li>
            </ul>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] font-label text-on-surface-variant/40">
              © 2026 ChinaVerse 中华宇宙. {isEn ? 'The Living Scroll Experience.' : '活着的画卷体验。'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
