'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ChevronRight, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm({ lang }: { lang: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEn = lang === 'en';

  const dict = {
    nav: { login: isEn ? 'Login' : '登录', register: isEn ? 'Register' : '注册' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(isEn ? 'Please fill in all fields.' : '请填写所有字段。');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        console.error('Login error:', authError);
        setError(authError.message || (isEn ? 'Login failed. Please try again.' : '登录失败，请重试。'));
        return;
      }

      if (!data.user) {
        setError(isEn ? 'Login failed. Please try again.' : '登录失败，请重试。');
        return;
      }

      // Success - redirect to dashboard
      const redirectTo = searchParams.get('redirect') || `/${lang}/dashboard`;
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error('Login catch error:', err);
      setError(isEn ? 'Login failed. Please try again.' : '登录失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-12 border border-white/20 relative overflow-hidden group">
        <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9e2016]/20 to-transparent"></div>
        
        <div className="space-y-10 relative z-10">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-5xl font-black text-[#1b1c1a] tracking-tight">
              {dict.nav.login}
            </h1>
            <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016] opacity-60">
               {isEn ? 'Aura of Antiquity' : '古韵之光'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 text-[#9e2016] text-xs p-5 rounded-2xl text-center font-sans font-bold flex items-center justify-center gap-3"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 ml-4">
                     {isEn ? 'Cultural ID (Email)' : '文化账号 (邮箱)'}
                  </label>
                  <div className="relative">
                     <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5]/50 border border-[#1b1c1a]/5 rounded-2xl px-14 py-5 text-sm focus:ring-4 focus:ring-[#9e2016]/5 focus:bg-white focus:border-[#9e2016]/20 transition-all outline-none"
                        placeholder="explorer@chinaverse.com"
                     />
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9e2016]/30 w-5 h-5" />
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30">
                       {isEn ? 'Passphrase' : '通行口令'}
                    </label>
                    <Link href={`/${lang}/forgot-password`} className="text-[10px] font-sans font-black uppercase tracking-widest text-[#9e2016]/40 hover:text-[#9e2016] transition-colors">
                       {isEn ? 'Forgot?' : '忘记？'}
                    </Link>
                  </div>
                  <div className="relative">
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5]/50 border border-[#1b1c1a]/5 rounded-2xl px-14 py-5 text-sm focus:ring-4 focus:ring-[#9e2016]/5 focus:bg-white focus:border-[#9e2016]/20 transition-all outline-none"
                        placeholder="••••••••"
                     />
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9e2016]/30 w-5 h-5" />
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#9e2016] text-white py-6 rounded-2xl font-sans font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#9e2016]/30 hover:bg-[#C0392B] hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed group/btn"
            >
               {loading ? (isEn ? 'Authenticating...' : '认证中...') : (
                 <>{isEn ? 'Enter Archive' : '进入档案库'} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
               )}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-[#1b1c1a]/5">
             <p className="text-[10px] font-sans font-black text-[#1b1c1a]/30 uppercase tracking-[0.2em]">
                {isEn ? "New to the Archive?" : "档案库新用户？"} 
                <Link href={`/${lang}/register`} className="text-[#9e2016] ml-3 hover:underline underline-offset-4">{dict.nav.register}</Link>
             </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
         <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/20 hover:text-[#9e2016] transition-colors">
            <ArrowLeft size={12} /> {isEn ? 'Back to Exploration' : '返回探索'}
         </Link>
      </div>
    </motion.div>
  );
}

function LoginFormFallback({ lang }: { lang: string }) {
  const isEn = lang === 'en';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-12 border border-white/20 relative overflow-hidden">
        <div className="animate-pulse space-y-8">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-14 bg-gray-200 rounded-2xl"></div>
            <div className="h-14 bg-gray-200 rounded-2xl"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    params.then(p => setLang(p.lang));
  }, [params]);

  return (
    <Suspense fallback={<LoginFormFallback lang={lang} />}>
      <LoginForm lang={lang} />
    </Suspense>
  );
}
