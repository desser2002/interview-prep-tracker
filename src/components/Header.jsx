import { RotateCcw, BookOpenCheck, Download } from 'lucide-react';

export default function Header({ topics, onReset, onExport }) {
  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);

  const handleReset = () => {
    if (window.confirm('Сбросить все данные и вернуться к импорту?')) {
      onReset();
    }
  };

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
              Interview Prep Tracker
            </h1>
            <p className="text-xs text-[#6e6e73]">
              {topics.length} {pluralizeTopic(topics.length)} · {totalQuestions} {pluralizeQ(totalQuestions)}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
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
            Экспорт
          </button>

          <button
            onClick={handleReset}
            className="
              flex items-center gap-2 px-4 py-2 rounded-full
              text-sm font-medium text-[#6e6e73]
              hover:text-[#1d1d1f] hover:bg-white
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-1
            "
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Сбросить
          </button>
        </div>
      </div>
    </header>
  );
}

function pluralizeTopic(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'тема';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'темы';
  return 'тем';
}

function pluralizeQ(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'вопрос';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'вопроса';
  return 'вопросов';
}
