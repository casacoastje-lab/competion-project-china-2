import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/dictionary';

export default async function Dashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect(`/${lang}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const dict = await getDictionary(lang as 'en' | 'zh');
  const isAdmin = profile?.role === 'admin';

  const stats = [
    { icon: 'Bookmark', label: isEn ? 'Relics Saved' : '收藏遗迹', value: '12' },
    { icon: 'GraduationCap', label: isEn ? 'Mastery Units' : '掌握课程', value: '5' },
    { icon: 'MapPin', label: isEn ? 'Provinces Visited' : '到访省份', value: '8' },
    { icon: 'Award', label: isEn ? 'Honor Rank' : '荣誉等级', value: isAdmin ? 'Admin' : '3' },
  ];

  const recentActivity = [
    { title: isEn ? 'The Great Wall: Imperial Defense' : '长城：帝国防线', time: isEn ? '2 hours ago' : '2小时前', type: 'blog' },
    { title: isEn ? 'Mandarin Basics: Tones' : '普通话基础：声调', time: isEn ? 'Yesterday' : '昨天', type: 'lesson' },
    { title: isEn ? 'Forbidden City' : '故宫博物院', time: isEn ? '3 days ago' : '3天前', type: 'landmark' },
  ];

  const dailyWisdom = isEn 
    ? { quote: "Under heaven all can see beauty as beauty only because there is ugliness.", source: "Lao Tzu, Tao Te Ching" }
    : { quote: "天下皆知美之为美，斯恶已；皆知善之为善，斯不善已。", source: "《道德经》· 老子" };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] pt-32 pb-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9e2016]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="px-3 py-1 bg-[#9e2016] rounded-full">
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-white">
                    {isEn ? 'Admin' : '管理员'}
                  </p>
                </div>
              )}
              <div className="px-3 py-1 bg-[#9e2016]/10 rounded-full">
                <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#9e2016]">
                  {isEn ? 'Archivist Access' : '档案管理员权限'}
                </p>
              </div>
            </div>
            <h1 className="font-serif text-6xl font-black text-[#1b1c1a] tracking-tight">
              {isEn ? 'Welcome back, ' : '欢迎回来，'}<span className="text-[#9e2016]/80">{profile?.display_name || profile?.username || user.email?.split('@')[0]}</span>
            </h1>
            {isAdmin && (
              <p className="text-sm text-[#9e2016]/60 font-sans">
                {isEn ? 'You have full access to the admin panel.' : '您拥有管理员面板的完整访问权限。'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={`/${lang}/settings`}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#1b1c1a]/5 hover:border-[#9e2016]/20 hover:text-[#9e2016] transition-all shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </Link>
            <Link 
              href={`/${lang}/auth/signout`}
              className="px-8 py-4 bg-[#1b1c1a] text-white rounded-full font-sans font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#9e2016] transition-all flex items-center gap-3 shadow-xl"
            >
              {isEn ? 'Evoke Exit' : '退出登录'}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 space-y-12">
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/40 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-sm flex items-center gap-6 group hover:translate-x-2 transition-all">
                  <div className="w-14 h-14 bg-[#9e2016]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#9e2016] group-hover:text-white transition-colors text-[#9e2016]">
                    {stat.icon === 'Bookmark' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>}
                    {stat.icon === 'GraduationCap' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                    {stat.icon === 'MapPin' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                    {stat.icon === 'Award' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>}
                  </div>
                  <div>
                    <p className="text-3xl font-serif font-black text-[#1b1c1a]">{stat.value}</p>
                    <p className="text-[9px] font-sans font-black text-[#1b1c1a]/30 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <div className="bg-[#1b1c1a] rounded-[48px] p-12 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#9e2016]/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10 space-y-6">
                <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016]">
                  {isEn ? 'Daily Wisdom' : '古语今智'}
                </p>
                <p className="font-serif text-2xl md:text-3xl leading-relaxed italic text-white/90">
                  &quot;{dailyWisdom.quote}&quot;
                </p>
                <div className="h-[1px] w-12 bg-[#9e2016]"></div>
                <p className="text-xs font-sans font-bold text-white/40 uppercase tracking-widest">
                  — {dailyWisdom.source}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-4xl font-black text-[#1b1c1a] tracking-tight">
                  {isEn ? 'Recent Exploration' : '最近探索'}
                </h2>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-[#1b1c1a]/5 flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#1b1c1a]/5 flex items-center justify-center text-[#1b1c1a]/40 group-hover:text-[#9e2016] transition-colors">
                        {activity.type === 'blog' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}
                        {activity.type === 'lesson' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                        {activity.type === 'landmark' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                      </div>
                      <div>
                        <p className="font-serif text-xl font-bold text-[#1b1c1a]">{activity.title}</p>
                        <p className="text-[10px] font-sans font-bold text-[#1b1c1a]/30 uppercase tracking-widest mt-1">{activity.time}</p>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#1b1c1a]/20 group-hover:translate-x-2 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <h2 className="font-serif text-3xl font-black text-[#1b1c1a] tracking-tight">
              {isEn ? 'Direct Tunnels' : '快速通道'}
            </h2>
            <div className="space-y-4">
              <Link href={`/${lang}/blog`} className="block p-8 rounded-[40px] bg-[#9e2016] text-white group transition-all hover:translate-y-[-4px] shadow-xl shadow-[#9e2016]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <div className="mt-6">
                  <p className="font-serif text-2xl font-black">{isEn ? 'Imperial Blog' : '档案博客'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-white/40">{isEn ? 'New chronicles' : '最新纪事'}</p>
                </div>
              </Link>
              <Link href={`/${lang}/lessons`} className="block p-8 rounded-[40px] bg-white text-[#1b1c1a] border border-[#1b1c1a]/5 hover:shadow-2xl transition-all hover:translate-y-[-4px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9e2016]"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <div className="mt-6">
                  <p className="font-serif text-2xl font-black">{isEn ? 'Learning Path' : '修身书院'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-[#1b1c1a]/30">{isEn ? 'Master the arts' : '学习文化精髓'}</p>
                </div>
              </Link>
              <Link href={`/${lang}/landmarks`} className="block p-8 rounded-[40px] bg-white text-[#1b1c1a] border border-[#1b1c1a]/5 hover:shadow-2xl transition-all hover:translate-y-[-4px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9e2016]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div className="mt-6">
                  <p className="font-serif text-2xl font-black">{isEn ? 'Relic Map' : '遗迹舆图'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-[#1b1c1a]/30">{isEn ? 'Explore layout' : '探索九州地志'}</p>
                </div>
              </Link>
              <Link href={`/${lang}/bookmarks`} className="block p-8 rounded-[40px] bg-white text-[#1b1c1a] border border-[#1b1c1a]/5 hover:shadow-2xl transition-all hover:translate-y-[-4px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9e2016]"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                <div className="mt-6">
                  <p className="font-serif text-2xl font-black">{isEn ? 'Private Library' : '私人馆藏'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-[#1b1c1a]/30">{isEn ? 'Personal vault' : '您的个人收藏'}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
