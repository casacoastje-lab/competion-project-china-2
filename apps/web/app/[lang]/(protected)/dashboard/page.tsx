import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/dictionary';
import { BookOpen, GraduationCap, MapPin, Bookmark, Settings, LogOut, Award, TrendingUp, Sparkles, ChevronRight, History, Calendar } from 'lucide-react';

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

  const stats = [
    { icon: Bookmark, label: isEn ? 'Relics Saved' : '收藏遗迹', value: '12' },
    { icon: GraduationCap, label: isEn ? 'Mastery Units' : '掌握课程', value: '5' },
    { icon: MapPin, label: isEn ? 'Provinces Visited' : '到访省份', value: '8' },
    { icon: Award, label: isEn ? 'Honor Rank' : '荣誉等级', value: '3' },
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
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9e2016]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 bg-[#9e2016]/10 rounded-full">
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#9e2016]">
                    {isEn ? 'Archivist Access' : '档案管理员权限'}
                  </p>
               </div>
               <span className="text-[10px] text-[#1b1c1a]/20 font-sans font-black uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1 h-1 bg-[#1b1c1a]/20 rounded-full"></div>
                 {isEn ? 'Level 4 Portal' : '4级门户'}
               </span>
            </div>
            <h1 className="font-serif text-6xl font-black text-[#1b1c1a] tracking-tight">
              {isEn ? 'Welcome back, ' : '欢迎回来，'}<span className="text-[#9e2016]/80">{profile?.display_name || profile?.username || user.email?.split('@')[0]}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <Link 
                href={`/${lang}/settings`}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#1b1c1a]/5 hover:border-[#9e2016]/20 hover:text-[#9e2016] transition-all shadow-sm group"
             >
                <Settings size={20} className="group-hover:rotate-45 transition-transform" />
             </Link>
             <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="px-8 py-4 bg-[#1b1c1a] text-white rounded-full font-sans font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#9e2016] transition-all flex items-center gap-3 shadow-xl"
                >
                  {isEn ? 'Evoke Exit' : '退出登录'} <LogOut size={14} />
                </button>
             </form>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Sidebar (Left) */}
          <div className="lg:col-span-1 space-y-12">
             {/* Stats Column */}
             <div className="grid grid-cols-1 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/40 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-sm flex items-center gap-6 group hover:translate-x-2 transition-all">
                     <div className="w-14 h-14 bg-[#9e2016]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#9e2016] group-hover:text-white transition-colors">
                        <stat.icon size={22} />
                     </div>
                     <div>
                        <p className="text-3xl font-serif font-black text-[#1b1c1a]">{stat.value}</p>
                        <p className="text-[9px] font-sans font-black text-[#1b1c1a]/30 uppercase tracking-widest">{stat.label}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Center Content (Aggregator) */}
          <div className="lg:col-span-2 space-y-12">
             {/* Daily Wisdom Card */}
             <div className="bg-[#1b1c1a] rounded-[48px] p-12 text-white relative overflow-hidden group shadow-2xl">
                <Sparkles className="absolute top-10 right-10 text-[#9e2016]/40 w-12 h-12 rotate-12 group-hover:scale-125 transition-transform" />
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

             {/* Recent Activity */}
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <h2 className="font-serif text-4xl font-black text-[#1b1c1a] tracking-tight">
                     {isEn ? 'Recent Exploration' : '最近探索'}
                   </h2>
                   <Link href="#" className="text-[10px] font-sans font-black uppercase tracking-widest text-[#9e2016]/40 hover:text-[#9e2016]">
                      {isEn ? 'View Archive' : '查看全部'}
                   </Link>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-[#1b1c1a]/5 flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#1b1c1a]/5 flex items-center justify-center text-[#1b1c1a]/40 group-hover:text-[#9e2016] transition-colors">
                            {activity.type === 'blog' && <BookOpen size={20} />}
                            {activity.type === 'lesson' && <GraduationCap size={20} />}
                            {activity.type === 'landmark' && <MapPin size={20} />}
                         </div>
                         <div>
                            <p className="font-serif text-xl font-bold text-[#1b1c1a]">{activity.title}</p>
                            <p className="text-[10px] font-sans font-bold text-[#1b1c1a]/30 uppercase tracking-widest mt-1">{activity.time}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-[#1b1c1a]/20 group-hover:translate-x-2 transition-transform" />
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Quick Actions (Right) */}
          <div className="lg:col-span-1 space-y-8">
             <h2 className="font-serif text-3xl font-black text-[#1b1c1a] tracking-tight">
               {isEn ? 'Direct Tunnels' : '快速通道'}
             </h2>
             <div className="space-y-4">
               {[
                 { href: `/${lang}/blog`, title: isEn ? 'Imperial Blog' : '档案博客', desc: isEn ? 'New chronicles' : '最新纪事', icon: History, bg: 'bg-[#9e2016] text-white' },
                 { href: `/${lang}/lessons`, title: isEn ? 'Learning Path' : '修身书院', desc: isEn ? 'Master the arts' : '学习文化精髓', icon: GraduationCap, bg: 'bg-white text-[#1b1c1a]' },
                 { href: `/${lang}/landmarks`, title: isEn ? 'Relic Map' : '遗迹舆图', desc: isEn ? 'Explore layout' : '探索九州地志', icon: MapPin, bg: 'bg-white text-[#1b1c1a]' },
                 { href: `/${lang}/bookmarks`, title: isEn ? 'Private Library' : '私人馆藏', desc: isEn ? 'Personal vault' : '您的个人收藏', icon: Bookmark, bg: 'bg-white text-[#1b1c1a]' },
               ].map((action, idx) => (
                  <Link key={idx} href={action.href} className={`block p-8 rounded-[40px] group transition-all hover:translate-y-[-4px] shadow-sm ${action.bg} ${action.bg === 'bg-white' ? 'border border-[#1b1c1a]/5 hover:shadow-2xl' : 'shadow-xl shadow-[#9e2016]/20'}`}>
                     <action.icon size={28} className={action.bg === 'bg-white' ? 'text-[#9e2016]' : 'text-white/40'} />
                     <div className="mt-6">
                        <p className="font-serif text-2xl font-black">{action.title}</p>
                        <p className={`text-[10px] font-sans font-black uppercase tracking-widest mt-1 ${action.bg === 'bg-white' ? 'text-[#1b1c1a]/30' : 'text-white/40'}`}>
                          {action.desc}
                        </p>
                     </div>
                  </Link>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}