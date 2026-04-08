import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/dictionary';

export default async function Settings({ params }: { params: Promise<{ lang: string }> }) {
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

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] pt-32 pb-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9e2016]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <Link href={`/${lang}/dashboard`} className="inline-flex items-center gap-2 text-sm text-[#1b1c1a]/40 hover:text-[#9e2016] transition-colors mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            {isEn ? 'Back to Dashboard' : '返回仪表板'}
          </Link>
          <h1 className="font-serif text-5xl font-black text-[#1b1c1a] tracking-tight">
            {isEn ? 'Settings' : '设置'}
          </h1>
          <p className="text-[#1b1c1a]/60 mt-2">
            {isEn ? 'Manage your account preferences' : '管理您的账户偏好'}
          </p>
        </header>

        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-[40px] p-10 border border-[#1b1c1a]/5 shadow-sm">
            <h2 className="font-serif text-2xl font-black text-[#1b1c1a] mb-8">
              {isEn ? 'Profile Information' : '个人信息'}
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-[#9e2016]/10 rounded-full flex items-center justify-center text-[#9e2016] text-3xl font-serif font-black">
                  {profile?.display_name?.[0] || profile?.username?.[0] || user.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-2xl font-serif font-black text-[#1b1c1a]">{profile?.display_name || profile?.username}</p>
                  <p className="text-sm text-[#1b1c1a]/60">{user.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#9e2016]/10 text-[#9e2016] text-xs font-black uppercase tracking-widest rounded-full">
                    {profile?.role || 'reader'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white rounded-[40px] p-10 border border-[#1b1c1a]/5 shadow-sm">
            <h2 className="font-serif text-2xl font-black text-[#1b1c1a] mb-8">
              {isEn ? 'Language' : '语言'}
            </h2>
            <div className="flex gap-4">
              <Link href={`/en${window?.location?.pathname?.replace(`/${lang}`, '') || ''}`} className="px-6 py-3 bg-[#1b1c1a] text-white rounded-full font-sans font-black text-sm">
                English
              </Link>
              <Link href={`/zh${window?.location?.pathname?.replace(`/${lang}`, '') || ''}`} className="px-6 py-3 bg-white border border-[#1b1c1a]/10 text-[#1b1c1a] rounded-full font-sans font-black text-sm hover:border-[#9e2016] transition-colors">
                中文
              </Link>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-[40px] p-10 border border-[#1b1c1a]/5 shadow-sm">
            <h2 className="font-serif text-2xl font-black text-[#1b1c1a] mb-8">
              {isEn ? 'Account' : '账户'}
            </h2>
            <Link 
              href={`/${lang}/auth/signout`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-full font-sans font-black text-sm hover:bg-red-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              {isEn ? 'Sign Out' : '退出登录'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
