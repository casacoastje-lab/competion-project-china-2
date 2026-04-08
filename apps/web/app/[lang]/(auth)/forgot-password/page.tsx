'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ForgotPasswordPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  return (
    <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-[#9e2016]/5 p-12 border border-[#9e2016]/5 relative overflow-hidden group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-20 bg-[#9e2016] rounded-r-full group-focus-within:h-32 transition-all"></div>
      
      <div className="space-y-10 relative z-10">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-black text-[#1b1c1a]">
            {lang === 'en' ? 'Reset Password' : '重置密码'} <span className="text-[#9e2016]">{lang === 'en' ? '密码' : 'Reset'}</span>
          </h1>
          <p className="mt-4 text-xs font-sans uppercase tracking-[0.3em] text-[#1b1c1a]/40">
             {lang === 'en' ? 'We will send you a reset link via email' : '我们将通过邮件发送重置链接'}
          </p>
        </div>

        <form className="space-y-8">
          <div className="space-y-3">
             <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/40 ml-4">
                Email {lang === 'en' ? '邮箱' : 'Email'}
             </label>
             <div className="relative">
                <input 
                   type="email" 
                   className="w-full bg-[#FAF8F5] border border-[#1b1c1a]/5 rounded-2xl px-12 py-5 text-sm focus:ring-2 focus:ring-[#9e2016]/20 focus:bg-white transition-all outline-none"
                   placeholder="you@example.com"
                />
             </div>
          </div>

          <button className="w-full bg-[#9e2016] text-white py-5 rounded-2xl font-serif font-black text-xl shadow-xl shadow-[#9e2016]/20 hover:scale-[1.02] active:scale-95 transition-all">
             {lang === 'en' ? 'Send Reset Link' : '发送重置链接'}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-[#1b1c1a]/5">
           <p className="text-xs font-sans font-bold text-[#1b1c1a]/40 uppercase tracking-widest">
              {lang === 'en' ? "Remember your password?" : "想起密码了？"} 
              <Link href={`/${lang}/login`} className="text-[#9e2016] ml-2 font-black border-b border-transparent hover:border-[#9e2016]">
                {lang === 'en' ? 'Login' : '登录'}
              </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
