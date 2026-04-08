'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { User, LogOut, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlobalSearchModal from './GlobalSearchModal';

interface NavbarProps {
  lang: string;
  dict: any;
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setSupabase(supabaseClient);

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabaseClient.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    // Initial check
    supabaseClient.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (currentUser) {
        setUser(currentUser);
        supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single()
          .then(({ data }) => setProfile(data));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: `/${lang}/landmarks`, label: dict.nav.explore, labelZh: '探索', active: pathname.includes('/landmarks') },
    { href: `/${lang}/blog`, label: dict.nav.blog, labelZh: '博客', active: pathname.includes('/blog') },
    { href: `/${lang}/lessons`, label: dict.nav.learn, labelZh: '学习', active: pathname.includes('/lessons') },
  ];

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    window.location.href = `/${lang}/login`;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href={`/${lang}`} className="text-2xl font-serif font-bold text-[#9e2016] tracking-tighter italic hover:opacity-80 transition-opacity">
              ChinaVerse 中华宇宙
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className={cn(
                    "flex flex-col items-start transition-all duration-300",
                    link.active 
                      ? "text-[#9e2016] font-bold border-b-2 border-[#9e2016] pb-1" 
                      : "text-[#1b1c1a]/60 font-medium hover:text-[#9e2016]"
                  )}
                >
                  <span className="text-sm tracking-tight">{link.label}</span>
                  <span className="text-[10px] opacity-60 leading-none">{link.labelZh}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-3 bg-[#1b1c1a]/5 hover:bg-[#9e2016]/10 rounded-full transition-all group"
              aria-label="Search Heritage Archive"
            >
               <Search size={18} className="text-[#1b1c1a]/40 group-hover:text-[#9e2016] transition-colors" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <Link 
                href={pathname.replace(`/${lang}`, lang === 'en' ? '/zh' : '/en')} 
                className="text-xs font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 hover:text-[#9e2016] transition-colors"
              >
                {lang === 'en' ? 'ZH|中' : 'EN|English'}
              </Link>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
            
            {user ? (
              /* Logged In State */
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-white/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#9e2016] flex items-center justify-center text-white font-serif italic text-lg shadow-lg shadow-[#9e2016]/20">
                    {profile?.display_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={cn("text-[#1b1c1a]/20 transition-transform", showDropdown && "rotate-180")} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-4 w-72 bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-[#1b1c1a]/5 overflow-hidden p-3 animate-in fade-in slide-in-from-top-4">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-[#9e2016]/5 flex items-center justify-center text-[#9e2016] font-serif font-black text-xl italic">
                          {profile?.display_name?.charAt(0).toUpperCase() || 'E'}
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="font-serif font-black text-[#1b1c1a] truncate">
                            {profile?.display_name || profile?.username || user.email?.split('@')[0]}
                          </p>
                          <p className="text-[10px] text-[#1b1c1a]/30 font-sans font-black uppercase tracking-widest truncate">{user.email}</p>
                       </div>
                    </div>
                    <div className="p-2 space-y-1">
                      {[
                        { href: `/${lang}/dashboard`, label: lang === 'en' ? 'Explorer Portal' : '控制台' },
                        { href: `/${lang}/bookmarks`, label: lang === 'en' ? 'Saved Relics' : '收藏夹' },
                        { href: `/${lang}/settings`, label: lang === 'en' ? 'Vault Settings' : '个人设置' },
                      ].map(item => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-6 py-4 rounded-3xl text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1b1c1a]/60 hover:bg-[#FAF8F5] hover:text-[#9e2016] transition-all"
                          onClick={() => setShowDropdown(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-6 py-4 rounded-3xl text-[10px] font-sans font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-all w-full text-left"
                        >
                          <LogOut size={14} />
                          {lang === 'en' ? 'Sever Access' : '退出登录'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out State */
              <Link 
                href={`/${lang}/login`} 
                className="bg-[#1b1c1a] text-white px-8 py-3 rounded-full font-sans font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#9e2016] hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-xl shadow-[#1b1c1a]/20"
              >
                {dict.nav.login}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Global Search Modal */}
      <GlobalSearchModal 
        lang={lang} 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}