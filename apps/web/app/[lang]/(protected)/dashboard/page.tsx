import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  BookMarked,
  BookOpen,
  Bookmark,
  Crown,
  MapPin,
  ScrollText,
  Sparkles,
  UserRound,
  PenLine,
  Trophy,
  Compass,
  Palette,
  Award,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ lang: string }>;
}

const grainBg =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

export default async function Dashboard({ params }: PageProps) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const supabase = await createClient();

  const { data: { user } = { user: null } } = await supabase.auth.getUser();

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
    .select(
      'id, created_at, posts:post_id(id, title_en, title_zh, cover_image_url, categories:category_id(name_en))',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id, earned_at, badges:badge_id(id, name, description, icon_url)')
    .eq('user_id', user.id);

  const { data: recentProgress } = await supabase
    .from('user_progress')
    .select(
      'id, progress_percent, completed, content_id, content_type, posts:post_id(id, title_en, title_zh, cover_image_url)',
    )
    .eq('user_id', user.id)
    .eq('content_type', 'blog')
    .order('last_accessed_at', { ascending: false })
    .limit(6);

  const role = profile?.role || 'reader';

  const stats = {
    lessonsComplete: recentProgress?.filter((p) => p.completed).length || 0,
    postsRead: recentProgress?.length || 0,
    badges: userBadges?.length || 0,
  };

  const roleChip = role === 'admin' ? 'Admin' : role === 'blogger' ? 'Blogger' : 'Reader';

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{ backgroundImage: grainBg }}
        aria-hidden
      />

      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/25">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-10">
            <Link href={`/${lang}`} className="text-2xl font-serif font-black text-primary tracking-tight italic">
              ChinaVerse 中华宇宙
            </Link>
            <nav className="hidden md:flex gap-7 items-center text-sm">
              <Link href={`/${lang}`} className="text-primary font-bold border-b-2 border-primary pb-1">
                {isEn ? 'Explore' : '探索'}
              </Link>
              <Link href={`/${lang}/blog`} className="text-on-surface/60 hover:text-primary transition-colors">
                {isEn ? 'Blog' : '博客'}
              </Link>
              <Link href={`/${lang}/lessons`} className="text-on-surface/60 hover:text-primary transition-colors">
                {isEn ? 'Learn' : '学习'}
              </Link>
              <Link href={`/${lang}/landmarks`} className="text-on-surface/60 hover:text-primary transition-colors">
                {isEn ? 'Map' : '地图'}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className={isEn ? 'font-bold text-primary' : ''}>EN</span>
              <span className="text-outline">|</span>
              <span className={!isEn ? 'font-bold text-primary' : ''}>中</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UserRound className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-10 max-w-[1280px] mx-auto space-y-14">
        {/* Hero profile */}
        <section className="flex flex-col md:flex-row items-start md:items-end gap-10">
          <div className="relative">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-[22px] overflow-hidden shadow-[0_35px_80px_-40px_rgba(27,28,26,0.45)] border-4 border-surface-container-lowest bg-surface-container-lowest">
              <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary text-4xl font-serif">
                {(profile?.display_name || profile?.username || user.email || 'U')[0]}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-secondary text-on-secondary px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-widest uppercase">{roleChip}</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-black font-serif tracking-tight">
                {profile?.display_name || profile?.username || user.email?.split('@')[0]}
              </h1>
              <Link
                href={`/${lang}/settings`}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-md shadow-lg shadow-primary/15 hover:scale-[0.99] transition-transform"
              >
                <PenLine className="w-4 h-4" />
                <span className="text-sm font-semibold">{isEn ? 'Edit Profile' : '编辑'}</span>
              </Link>
            </div>
            <div className="max-w-2xl space-y-2">
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
                {profile?.bio ||
                  (isEn
                    ? 'Curator of ancient scrolls and digital artifacts. Exploring the intersection of heritage and future tech.'
                    : '探索古籍与数字文物的策展人，研究传统与未来科技的交汇点。')}
              </p>
              <p className="text-base text-primary/75 font-serif">
                {isEn ? 'Living Scroll Seeker' : '活卷探索者'}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title={isEn ? 'Posts Read' : '阅读文章'}
            value={stats.postsRead}
            accent="primary"
            icon={<ScrollText className="w-6 h-6" />}
          />
          <StatCard
            title={isEn ? 'Lessons Completed' : '课程完成'}
            value={stats.lessonsComplete}
            accent="secondary"
            icon={<BookOpen className="w-6 h-6" />}
          />
          <StatCard
            title={isEn ? 'Badges Earned' : '获得徽章'}
            value={stats.badges}
            accent="tertiary"
            icon={<Trophy className="w-6 h-6" />}
          />
        </section>

        {/* Main content grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left: progress & badges */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-surface-container-lowest p-10 rounded-[28px] border border-outline-variant/25 shadow-[0_30px_60px_-25px_rgba(27,28,26,0.12)] relative overflow-hidden">
              <div className="absolute right-10 top-10 w-32 h-32 bg-primary/8 rounded-full blur-3xl" aria-hidden />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-on-surface-variant">
                    {isEn ? 'Recent Progress' : '最近进度'}
                  </p>
                  <h3 className="text-2xl font-serif font-black">The Living Scroll</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(recentProgress || []).slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="group bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 hover:border-outline/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">
                          {isEn ? 'Blog Progress' : '文章进度'}
                        </p>
                        <h4 className="text-xl font-serif font-black leading-tight text-on-surface">
                          {lang === 'en' ? item.posts?.title_en : item.posts?.title_zh || item.posts?.title_en}
                        </h4>
                      </div>
                      <Bookmark className="w-5 h-5 text-primary/50" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-on-surface-variant">
                      <span>{item.progress_percent ?? 0}%</span>
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <ArrowRight className="w-4 h-4" />
                        {isEn ? 'Continue' : '继续'}
                      </span>
                    </div>
                  </div>
                ))}
                {(recentProgress?.length || 0) === 0 && (
                  <p className="text-sm text-on-surface-variant col-span-2">
                    {isEn ? 'No progress yet.' : '暂无进度。'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(recentProgress || []).slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href={`/${lang}/blog/${item.content_id}`}
                  className="group relative overflow-hidden rounded-[28px] bg-on-surface text-background min-h-[240px] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)]"
                >
                  <div
                    className="absolute inset-0 opacity-60 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        item.posts?.cover_image_url ||
                        'https://images.unsplash.com/photo-1529429617124-aee1f1650a5c?auto=format&fit=crop&w=1200&q=80'
                      })`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/5" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/70">
                      <MapPin className="w-4 h-4" />
                      {item.content_type || 'Blog'}
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-black mb-2 leading-tight">
                        {lang === 'en' ? item.posts?.title_en : item.posts?.title_zh || item.posts?.title_en}
                      </h4>
                      <p className="text-sm text-white/80">{isEn ? 'Continue reading' : '继续阅读'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-8">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/35 shadow-[0_22px_44px_-28px_rgba(27,28,26,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <BookMarked className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">
                    {isEn ? 'Bookmarks' : '书签'}
                  </p>
                  <h4 className="text-xl font-serif font-black text-on-surface">
                    {isEn ? 'Save for later' : '稍后阅读'}
                  </h4>
                </div>
              </div>
              <div className="space-y-4">
                {bookmarks?.length ? (
                  bookmarks.map((bookmark) => (
                    <Link
                      key={bookmark.id}
                      href={`/${lang}/blog/${bookmark.posts?.id}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-lowest transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-surface-container-lowest shadow-inner flex items-center justify-center text-primary">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-on-surface group-hover:text-primary line-clamp-1">
                          {lang === 'en' ? bookmark.posts?.title_en : bookmark.posts?.title_zh || bookmark.posts?.title_en}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {bookmark.posts?.categories?.name_en || (isEn ? 'Culture' : '文化')}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-on-surface-variant">{isEn ? 'No bookmarks yet.' : '暂无书签。'}</p>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/35 shadow-[0_22px_44px_-28px_rgba(27,28,26,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-tertiary" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">
                    {isEn ? 'Latest Badges' : '最新徽章'}
                  </p>
                  <h4 className="text-xl font-serif font-black text-on-surface">{isEn ? 'Ink & Jade' : '墨与玉'}</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {userBadges?.length ? (
                  userBadges.map((badge) => (
                    <div
                      key={badge.badge_id}
                      className="group p-4 rounded-2xl bg-surface-container hover:bg-primary/5 transition-colors border border-outline-variant/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                        <Award className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-on-surface leading-tight line-clamp-2">
                        {badge.badges?.name || (isEn ? 'Badge' : '徽章')}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">{isEn ? 'Earned' : '已获得'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-on-surface-variant col-span-2">{isEn ? 'No badges yet.' : '暂无徽章。'}</p>
                )}
              </div>
            </div>

            <div className="bg-surface-container-low p-8 rounded-[28px] border border-outline-variant/35 shadow-[0_22px_44px_-28px_rgba(27,28,26,0.2)] space-y-3">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-secondary" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">
                    {isEn ? 'Journey' : '旅程'}
                  </p>
                  <h4 className="text-xl font-serif font-black text-on-surface">
                    {isEn ? 'The Living Scroll' : '活卷之旅'}
                  </h4>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {isEn
                  ? 'Keep exploring cultural landmarks, lessons, and stories. Your progress syncs across devices.'
                  : '继续探索文化地标、课程与故事，所有进度都会在设备间同步。'}
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-on-surface-variant">
                <JourneyItem icon={<Palette className="w-4 h-4 text-tertiary" />} text={isEn ? 'Ink your journey with new lessons weekly.' : '每周新增课程，持续精进。'} />
                <JourneyItem icon={<MapPin className="w-4 h-4 text-secondary" />} text={isEn ? 'Discover Sichuan routes curated for culture lovers.' : '发现为文化爱好者精选的四川路线。'} />
                <JourneyItem icon={<ScrollText className="w-4 h-4 text-primary" />} text={isEn ? 'Read bilingual editorials crafted with local experts.' : '阅读本地专家撰写的双语专题。'} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, accent, icon }: { title: string; value: number; accent: 'primary' | 'secondary' | 'tertiary'; icon: ReactNode }) {
  const accentClasses = {
    primary: 'border-l-4 border-primary bg-surface-container-low',
    secondary: 'border-l-4 border-secondary bg-surface-container-low',
    tertiary: 'border-l-4 border-tertiary bg-surface-container-low',
  }[accent];

  const tint = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
  }[accent];

  return (
    <div className={`${accentClasses} p-8 rounded-2xl shadow-[0_24px_60px_-30px_rgba(27,28,26,0.25)] flex items-center gap-6`}>
      <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center ${tint}`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs uppercase tracking-widest text-on-surface-variant">{title}</div>
      </div>
    </div>
  );
}

function JourneyItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}
