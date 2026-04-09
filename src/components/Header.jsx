import { BookOpenCheck, Download } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function Header({ name, topics, onExport }) {
  const { t, lang, setLang } = useLanguage();
  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questions.length, 0);

  return (
    <header
      className="sticky top-0 z-10 px-6 py-4"
      style={{
        background: 'rgba(245,245,247,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Left: title + icon */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center flex-shrink-0">
            <BookOpenCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#1d1d1f] leading-tight">
              {name ?? 'Interview Prep Tracker'}
            </h1>
            <p className="text-xs text-[#6e6e73]">
              {t('topicsCount', topics.length)} · {t('questionsCount', totalQuestions)}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(t('switchTo'))}
            className="
              px-3 py-1.5 rounded-full
              text-xs font-semibold text-[#6e6e73]
              hover:bg-white transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-1
            "
            style={{ border: '1px solid rgba(0,0,0,0.15)' }}
            title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          >
            {t('languageName')}
          </button>

          <button
            onClick={onExport}
            className="
              flex items-center gap-2 px-4 py-2 rounded-full
              text-sm font-medium text-[#0071e3]
              hover:bg-white transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-1
            "
            style={{ border: '1px solid rgba(0,113,227,0.25)' }}
          >
            <Download className="w-3.5 h-3.5" />
            {t('export')}
          </button>
        </div>
      </div>
    </header>
  );
}
