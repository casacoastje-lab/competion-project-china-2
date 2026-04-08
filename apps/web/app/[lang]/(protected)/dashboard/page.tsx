import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/dictionary';

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

  const isAdmin = profile?.role === 'admin';
  const isBlogger = profile?.role === 'blogger' || isAdmin;

  const { data: stats } = await supabase.rpc('get_user_stats', { user_id: user.id });

  const { data: recentActivity } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, posts:post_id(title_en, title_zh, cover_image_url)')
    .eq('user_id', user.id)
    .limit(3);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badges:badge_id(name, icon_url)')
    .eq('user_id', user.id);

  const { data: myPosts } = isBlogger ? await supabase
    .from('posts')
    .select('id, title_en, title_zh, view_count, published_at')
    .eq('author_id', user.id)
    .order('view_count', { ascending: false })
    .limit(5) : { data: null };

  const getActivityIcon = (actionType: string) => {
    const icons: Record<string, string> = {
      login: 'login',
      logout: 'logout',
      view_post: 'visibility',
      view_landmark: 'location_on',
      view_lesson: 'school',
      bookmark_post: 'bookmark',
      like_post: 'favorite',
      comment_post: 'comment',
      complete_lesson: 'check_circle',
      earn_badge: 'workspace_premium',
      create_post: 'edit',
      update_profile: 'manage_accounts'
    };
    return icons[actionType] || 'circle';
  };

  const getActivityColor = (actionType: string) => {
    const colors: Record<string, string> = {
      login: 'bg-secondary-container',
      logout: 'bg-surface-container-highest',
      view_post: 'bg-primary-fixed',
      earn_badge: 'bg-tertiary-fixed',
      create_post: 'bg-secondary-container',
      default: 'bg-surface-container-highest'
    };
    return colors[actionType] || colors.default;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return isEn ? 'Just now' : '刚刚';
    if (diffMins < 60) return isEn ? `${diffMins}m ago` : `${diffMins}分钟前`;
    if (diffHours < 24) return isEn ? `${diffHours}h ago` : `${diffHours}小时前`;
    if (diffDays < 7) return isEn ? `${diffDays}d ago` : `${diffDays}天前`;
    return then.toLocaleDateString();
  };

  const getRoleLabel = () => {
    if (isAdmin) return isEn ? 'Admin' : '管理员';
    if (isBlogger) return isEn ? 'Blogger' : '博主';
    return isEn ? 'Reader' : '读者';
  };

  const userStats = stats?.[0] || {
    posts_viewed: 0,
    bookmarks_count: bookmarks?.length || 0,
    badges_earned: userBadges?.length || 0,
    posts_created: myPosts?.length || 0
  };

  return (
    <div className="min-h-screen bg-surface font-sans">
      <div className="grain-texture absolute inset-0" />
      
      <nav className="bg-[#fef9eb]/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-tertiary/20">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-8">
            <Link href={`/${lang}`} className="text-2xl font-bold text-primary font-serif border-t-2 border-tertiary">
              ChinaVerse
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href={`/${lang}`} className="text-on-surface hover:text-primary transition-colors font-serif text-lg">Home</Link>
              <Link href={`/${lang}/blog`} className="text-on-surface hover:text-primary transition-colors font-serif text-lg">Gallery</Link>
              <Link href={`/${lang}/landmarks`} className="text-on-surface hover:text-primary transition-colors font-serif text-lg">Map</Link>
              <Link href={`/${lang}/lessons`} className="text-on-surface hover:text-primary transition-colors font-serif text-lg">Learning</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/dashboard`} className="p-2 hover:bg-primary/5 transition-all text-primary border-b-2 border-primary pb-1 font-bold">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link href={`/${lang}/settings`} className="p-2 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <Link href={`/${lang}/auth/signout`} className="p-2 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined">logout</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
          <div className="relative group">
            <div className="w-32 h-32 bg-primary flex items-center justify-center border-4 border-tertiary-fixed shadow-xl">
              <span className="text-on-primary text-5xl font-serif font-bold">
                {profile?.display_name?.[0] || profile?.username?.[0] || user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-secondary p-1 border-2 border-surface">
              <span className="material-symbols-outlined text-on-secondary text-sm">verified</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-serif font-bold text-on-surface tracking-tight uppercase">
              {profile?.username || user.email?.split('@')[0]}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-on-surface-variant font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-lg">school</span>
                {getRoleLabel()}
              </span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-lg">mail</span>
                {user.email}
              </span>
            </div>
          </div>
          <div className="md:ml-auto">
            <Link href={`/${lang}/settings`} className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined">edit</span>
              <span className="font-medium">{isEn ? 'Edit Profile' : '编辑资料'}</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="bg-surface-container-low p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rotate-45 translate-x-12 -translate-y-12" />
              <h3 className="font-serif text-xs tracking-widest text-tertiary uppercase mb-6">
                {isEn ? 'Archive Statistics' : '数据统计'}
              </h3>
              <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-primary">
                    {userStats.posts_viewed || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    {isEn ? 'Posts Read' : '已读文章'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-primary">
                    {userStats.bookmarks_count || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    {isEn ? 'Bookmarks' : '收藏'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-secondary">
                    {userStats.badges_earned || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    {isEn ? 'Achievements' : '成就'}
                  </span>
                </div>
                {isBlogger && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-serif font-bold text-secondary">
                      {userStats.posts_created || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                      {isEn ? 'Posts Written' : '已发布'}
                    </span>
                  </div>
                )}
                {!isBlogger && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-serif font-bold text-secondary">
                      {myPosts?.length || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                      {isEn ? 'Lessons Done' : '已完成'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {userBadges && userBadges.length > 0 && (
              <div className="bg-surface-container p-8">
                <h3 className="font-serif text-xs tracking-widest text-tertiary uppercase mb-6">
                  {isEn ? 'Earned Badges' : '已获勋章'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {userBadges.slice(0, 6).map((badge: any) => (
                    <div key={badge.badge_id} className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center" title={badge.badges?.name}>
                      <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-surface-container-high p-8">
              <h3 className="font-serif text-xs tracking-widest text-tertiary uppercase mb-6">
                {isEn ? "Scholar's Shortcuts" : '快捷入口'}
              </h3>
              <div className="flex flex-col gap-3">
                <Link href={`/${lang}/blog`} className="group flex items-center justify-between p-4 bg-surface hover:bg-primary hover:text-on-primary transition-all duration-300">
                  <span className="font-medium">{isEn ? 'Browse Articles' : '浏览文章'}</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link href={`/${lang}/lessons`} className="group flex items-center justify-between p-4 bg-surface hover:bg-secondary hover:text-on-primary transition-all duration-300">
                  <span className="font-medium">{isEn ? 'Continue Learning' : '继续学习'}</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">menu_book</span>
                </Link>
                <Link href={`/${lang}/landmarks`} className="group flex items-center justify-between p-4 bg-surface hover:bg-surface-dim transition-all duration-300">
                  <span className="font-medium">{isEn ? 'Explore Map' : '探索地图'}</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">map</span>
                </Link>
                <Link href={`/${lang}/bookmarks`} className="group flex items-center justify-between p-4 bg-surface hover:bg-surface-dim transition-all duration-300">
                  <span className="font-medium">{isEn ? 'My Bookmarks' : '我的收藏'}</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bookmark</span>
                </Link>
                {isBlogger && (
                  <Link href={`/${lang}/blog/new`} className="group flex items-center justify-between p-4 border border-primary/20 text-primary hover:bg-primary hover:text-on-primary transition-all duration-300">
                    <span className="font-medium">{isEn ? 'Write Post' : '写文章'}</span>
                    <span className="material-symbols-outlined">edit_note</span>
                  </Link>
                )}
                <Link href={`/${lang}`} className="group flex items-center justify-between p-4 border border-outline transition-all duration-300">
                  <span className="font-medium">{isEn ? 'Back to Home' : '返回首页'}</span>
                  <span className="material-symbols-outlined">home</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="bg-surface-container-lowest p-8 min-h-full border border-outline">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-serif font-bold text-on-surface">
                  {isEn ? 'Recent Activity Feed' : '最近活动'}
                </h2>
                <span className="material-symbols-outlined text-tertiary">history</span>
              </div>
              
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-12 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant" />
                  
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="relative pl-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${getActivityColor(activity.action_type)} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-xs">
                          {getActivityIcon(activity.action_type)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">
                          {activity.action_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-on-surface-variant">
                          {activity.target_type ? `Target: ${activity.target_type}` : 'System activity'}
                        </p>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-secondary font-bold whitespace-nowrap">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">explore</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-2">
                    {isEn ? 'No Activity Yet' : '暂无活动'}
                  </h4>
                  <p className="text-sm text-on-surface-variant mb-6">
                    {isEn 
                      ? 'Start exploring ChinaVerse to see your activity here!' 
                      : '开始探索中华宇宙，在这里查看您的活动记录！'}
                  </p>
                  <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary hover:bg-primary-container transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                    <span>{isEn ? 'Start Exploring' : '开始探索'}</span>
                  </Link>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="bg-surface-container-lowest p-8 mt-8 border border-outline">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-on-surface">
                    {isEn ? 'Admin Panel' : '管理面板'}
                  </h2>
                  <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href={`/${lang}/admin/posts`} className="p-4 bg-surface-container hover:bg-primary hover:text-on-primary transition-all text-center">
                    <span className="material-symbols-outlined text-2xl block mb-2">article</span>
                    <span className="text-sm font-medium">{isEn ? 'Manage Posts' : '管理文章'}</span>
                  </Link>
                  <Link href={`/${lang}/admin/users`} className="p-4 bg-surface-container hover:bg-primary hover:text-on-primary transition-all text-center">
                    <span className="material-symbols-outlined text-2xl block mb-2">group</span>
                    <span className="text-sm font-medium">{isEn ? 'Manage Users' : '管理用户'}</span>
                  </Link>
                  <Link href={`/${lang}/admin/landmarks`} className="p-4 bg-surface-container hover:bg-primary hover:text-on-primary transition-all text-center">
                    <span className="material-symbols-outlined text-2xl block mb-2">location_on</span>
                    <span className="text-sm font-medium">{isEn ? 'Manage Landmarks' : '管理地标'}</span>
                  </Link>
                  <Link href={`/${lang}/admin/lessons`} className="p-4 bg-surface-container hover:bg-primary hover:text-on-primary transition-all text-center">
                    <span className="material-symbols-outlined text-2xl block mb-2">school</span>
                    <span className="text-sm font-medium">{isEn ? 'Manage Lessons' : '管理课程'}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-surface border-t border-tertiary/20 py-12">
        <div className="flex flex-col items-center gap-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 px-4">
            <Link href={`/${lang}`} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-opacity">
              About
            </Link>
            <Link href={`/${lang}/blog`} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-opacity">
              Blog
            </Link>
            <Link href={`/${lang}/landmarks`} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-opacity">
              Map
            </Link>
            <Link href={`/${lang}/settings`} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-opacity">
              Settings
            </Link>
          </div>
          <p className="text-xs uppercase tracking-widest text-tertiary text-center">
            ChinaVerse 2026 | Cultural Heritage Project
          </p>
        </div>
      </footer>
    </div>
  );
}
