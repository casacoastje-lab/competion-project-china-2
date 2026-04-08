'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ChevronRight, User, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const [lang, setLang] = useState<string>('en');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then(p => setLang(p.lang));
  }, [params]);

  const isEn = lang === 'en';

  const dict = {
    nav: { login: isEn ? 'Login' : '登录', register: isEn ? 'Register' : '注册' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(isEn ? 'Please fill in all fields.' : '请填写所有字段。');
      return;
    }

    if (password !== confirmPassword) {
      setError(isEn ? 'Passwords do not match.' : '两次密码输入不一致。');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
        },
      });

      if (signUpError) {
        setError(isEn ? 'Registration failed. Please try again.' : '注册失败，请重试。');
        return;
      }

      setSuccess(true);
    } catch {
      setError(isEn ? 'Registration failed. Please try again.' : '注册失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-12 border border-white/20 text-center space-y-8"
      >
        <div className="w-20 h-20 mx-auto bg-[#9e2016]/5 rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} className="text-[#9e2016]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-black text-[#1b1c1a]">
            {isEn ? 'Check Your Email!' : '请查收邮件！'}
          </h2>
          <p className="text-sm text-[#1b1c1a]/60 font-sans leading-relaxed px-4">
            {isEn 
              ? 'We sent a verification link to your email. Please click the link to activate your heritage archive access.'
              : '我们已向您的邮箱发送了验证链接，请点击链接激活您的文化遗产档案访问权限。'}
          </p>
        </div>
        <div className="pt-4">
          <Link 
            href={`/${lang}/login`}
            className="inline-flex items-center gap-2 bg-[#9e2016] text-white px-8 py-4 rounded-2xl font-sans font-black text-xs uppercase tracking-widest hover:bg-[#C0392B] transition-all"
          >
            {isEn ? 'Proceed to Login' : '前往登录'} <ArrowRight size={14} className="opacity-40" />
          </Link>
        </div>
      </motion.div>
    );
  }

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
              {dict.nav.register}
            </h1>
            <p className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#9e2016] opacity-60">
               {isEn ? 'Join the Revival' : '加入文化复兴'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-4">
               {/* Username Input */}
               <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 ml-4">
                     {isEn ? 'Explorer Persona' : '探索者署名'}
                  </label>
                  <div className="relative">
                     <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#FAF8F5]/50 border border-[#1b1c1a]/5 rounded-2xl px-14 py-4 text-sm focus:ring-4 focus:ring-[#9e2016]/5 focus:bg-white focus:border-[#9e2016]/20 transition-all outline-none"
                        placeholder="zhang_san"
                     />
                     <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9e2016]/30 w-5 h-5" />
                  </div>
               </div>

               {/* Email Input */}
               <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 ml-4">
                     {isEn ? 'Heritage ID (Email)' : '遗产账号 (邮箱)'}
                  </label>
                  <div className="relative">
                     <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5]/50 border border-[#1b1c1a]/5 rounded-2xl px-14 py-4 text-sm focus:ring-4 focus:ring-[#9e2016]/5 focus:bg-white focus:border-[#9e2016]/20 transition-all outline-none"
                        placeholder="hello@chinaverse.com"
                     />
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9e2016]/30 w-5 h-5" />
                  </div>
               </div>

               {/* Password Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 ml-4">
                       {isEn ? 'Passphrase' : '口令'}
                    </label>
                    <div className="relative">
                       <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#FAF8F5]/50 border border-[#1b1c1a]/5 rounded-2xl px-14 py-4 text-sm focus:ring-4 focus:ring-[#9e2016]/5 focus:bg-white focus:border-[#9e2016]/20 transition-all outline-none"
                          placeholder="••••"
                       />
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9e2016]/30 w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#1b1c1a]/30 ml-4">
                       {isEn ? 'Confirm' : '确认'}
                    </label>
                    <div className="relative">
                       <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#FAF8F5]/50 border border-[#1b1c1a]/5 rounded-2xl px-14 py-4 text-sm focus:ring-4 focus:ring-[#9e2016]/5 focus:bg-white focus:border-[#9e2016]/20 transition-all outline-none"
                          placeholder="••••"
                       />
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9e2016]/30 w-5 h-5" />
                    </div>
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1b1c1a] text-white py-6 rounded-2xl font-sans font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#1b1c1a]/20 hover:bg-[#9e2016] hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed group/btn"
            >
               {loading ? (isEn ? 'Enrolling...' : '加入中...') : (
                 <>{isEn ? 'Become an Explorer' : '成为探索者'} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
               )}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-[#1b1c1a]/5">
             <p className="text-[10px] font-sans font-black text-[#1b1c1a]/30 uppercase tracking-[0.2em]">
                {isEn ? "Already an explorer?" : "已经是探索者？"} 
                <Link href={`/${lang}/login`} className="text-[#9e2016] ml-3 hover:underline underline-offset-4">{dict.nav.register}</Link>
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