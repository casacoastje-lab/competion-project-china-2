'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizProps {
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  lang: string;
}

export default function LessonQuiz({ quiz, lang }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selected === quiz.answer;

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="space-y-12">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 space-y-10 group">
         <h4 className="font-serif text-2xl md:text-3xl font-black text-center group-hover:text-[#D4A017] transition-colors leading-relaxed">
           {quiz.question}
         </h4>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quiz.options.map((option) => (
              <button
                key={option}
                disabled={showResult}
                onClick={() => setSelected(option)}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all font-serif font-black text-lg shadow-xl",
                  selected === option 
                    ? "bg-[#D4A017] text-[#1b1c1a] border-[#D4A017]" 
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white/60",
                  showResult && option === quiz.answer && "bg-green-500/20 border-green-500 text-green-400",
                  showResult && option === selected && option !== quiz.answer && "bg-red-500/20 border-red-500 text-red-400"
                )}
              >
                {option}
              </button>
            ))}
         </div>

         {!showResult && selected && (
            <div className="flex justify-center pt-8">
               <button 
                 onClick={() => setShowResult(true)}
                 className="bg-[#D4A017] text-[#1b1c1a] px-12 py-5 rounded-full font-serif font-black text-lg hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-[#D4A017]/40"
               >
                 {lang === 'en' ? 'Submit Answer' : '提交回答'}
               </button>
            </div>
         )}
      </div>

      {showResult && (
         <div className={cn(
           "p-10 rounded-[40px] border relative overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700",
           isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
         )}>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
               <div className={cn(
                 "p-6 rounded-full",
                 isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
               )}>
                  {isCorrect ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
               </div>
               <div className="space-y-4 flex-1">
                  <h5 className="font-serif text-3xl font-black">
                    {isCorrect 
                      ? (lang === 'en' ? 'Brilliant Mastery!' : '掌握精妙！') 
                      : (lang === 'en' ? 'Deepening Context...' : '正在深化背景...')}
                  </h5>
                  <p className="font-sans text-lg text-white/60 italic leading-relaxed">
                    {quiz.explanation}
                  </p>
               </div>
               <button 
                 onClick={handleReset}
                 className="p-6 rounded-full bg-white/5 border border-white/10 hover:bg-[#D4A017] hover:text-[#1b1c1a] transition-all group"
                 title={lang === 'en' ? 'Retry' : '重新尝试'}
               >
                  <RotateCcw size={24} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
               </button>
            </div>
         </div>
      )}
    </div>
  );
}
