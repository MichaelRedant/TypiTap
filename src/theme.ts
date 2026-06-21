export interface AppTheme {
  bgMain: string;
  bgHeader: string;
  bgCard: string;
  textTitle: string;
  textSubtle: string;
  textMuted: string;
  btnGradient: string;
  accentColor: string;
  isDark: boolean;
  name: 'young' | 'older';
  // Chapter colors for LevelMap
  chapters: Array<{
    bg: string;
    border: string;
    title: string;
    bar: string;
    btn: string;
  }>;
}

export const youngTheme: AppTheme = {
  bgMain: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
  bgHeader: 'rgba(255,255,255,0.8)',
  bgCard: 'rgba(255,255,255,0.7)',
  textTitle: '#7C3AED',
  textSubtle: '#A78BFA',
  textMuted: '#94A3B8',
  btnGradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
  accentColor: '#7C3AED',
  isDark: false,
  name: 'young',
  chapters: [
    { bg: 'from-purple-100 to-purple-50', border: 'border-purple-200', title: 'text-purple-700', bar: 'bg-purple-600', btn: 'bg-purple-600' },
    { bg: 'from-blue-100 to-blue-50',     border: 'border-blue-200',   title: 'text-blue-700',   bar: 'bg-blue-600',   btn: 'bg-blue-600'   },
    { bg: 'from-green-100 to-green-50',   border: 'border-green-200',  title: 'text-green-700',  bar: 'bg-green-600',  btn: 'bg-green-600'  },
    { bg: 'from-orange-100 to-orange-50', border: 'border-orange-200', title: 'text-orange-700', bar: 'bg-orange-500', btn: 'bg-orange-500' },
    { bg: 'from-pink-100 to-pink-50',     border: 'border-pink-200',   title: 'text-pink-700',   bar: 'bg-pink-500',   btn: 'bg-pink-500'   },
  ],
};

export const olderTheme: AppTheme = {
  bgMain: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0B1120 100%)',
  bgHeader: 'rgba(15,23,42,0.9)',
  bgCard: 'rgba(255,255,255,0.06)',
  textTitle: '#38BDF8',
  textSubtle: '#7DD3FC',
  textMuted: '#475569',
  btnGradient: 'linear-gradient(135deg, #0284C7, #0369A1)',
  accentColor: '#0EA5E9',
  isDark: true,
  name: 'older',
  chapters: [
    { bg: 'from-sky-900/40 to-sky-950/40',     border: 'border-sky-700/40',     title: 'text-sky-300',     bar: 'bg-sky-500',     btn: 'bg-sky-600'     },
    { bg: 'from-cyan-900/40 to-cyan-950/40',   border: 'border-cyan-700/40',   title: 'text-cyan-300',   bar: 'bg-cyan-500',   btn: 'bg-cyan-600'   },
    { bg: 'from-teal-900/40 to-teal-950/40',   border: 'border-teal-700/40',   title: 'text-teal-300',   bar: 'bg-teal-500',   btn: 'bg-teal-600'   },
    { bg: 'from-amber-900/40 to-amber-950/40', border: 'border-amber-700/40', title: 'text-amber-300', bar: 'bg-amber-500', btn: 'bg-amber-600' },
    { bg: 'from-rose-900/40 to-rose-950/40',   border: 'border-rose-700/40',   title: 'text-rose-300',   bar: 'bg-rose-500',   btn: 'bg-rose-600'   },
  ],
};
