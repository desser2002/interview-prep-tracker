import { useLanguage } from '../hooks/useLanguage';

const STATUS_COLORS = {
  done:    '#34c759',
  partial: '#ff9f0a',
  fail:    '#ff3b30',
  none:    'transparent',
};

export default function ProgressBanner({ topics }) {
  const { t } = useLanguage();
  const allQuestions = topics.flatMap((topic) => topic.questions);
  const total = allQuestions.length;
  const done    = allQuestions.filter((q) => q.status === 'done').length;
  const partial = allQuestions.filter((q) => q.status === 'partial').length;
  const fail    = allQuestions.filter((q) => q.status === 'fail').length;
  const percent        = total > 0 ? Math.round((done / total) * 100) : 0;
  const percentPartial = total > 0 ? Math.round(((done + partial) / total) * 100) : 0;

  return (
    <div
      className="bg-white rounded-2xl px-8 py-6"
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top row */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-[#6e6e73] uppercase tracking-wider mb-1">
            {t('overallProgress')}
          </p>
          <p className="text-4xl font-bold text-[#1d1d1f] leading-none tracking-tight">
            {percent}
            <span className="text-xl font-semibold text-[#6e6e73] ml-1">%</span>
            {percentPartial > percent && (
              <span className="text-xl font-semibold ml-2" style={{ color: 'rgba(0,0,0,0.2)' }}>
                {percentPartial}%
              </span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5">
          <Stat value={done}    label={t('mastered')}   color="#34c759" />
          <Stat value={partial} label={t('partial')}    color="#ff9f0a" />
          <Stat value={fail}    label={t('failed')}     color="#ff3b30" />
          <Stat value={total - done - partial - fail} label={t('notStarted')} color="#c7c7cc" />
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="h-3 rounded-full overflow-hidden flex gap-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
        {['fail', 'partial', 'done'].map((status) => {
          const count = allQuestions.filter((q) => q.status === status).length;
          const w = total > 0 ? (count / total) * 100 : 0;
          if (w === 0) return null;
          return (
            <div
              key={status}
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${w}%`, background: STATUS_COLORS[status] }}
            />
          );
        })}
      </div>

      {/* Bottom: question count */}
      <p className="text-xs text-[#6e6e73] mt-3">
        {t('progressSummary', done, total, topics.length)}
      </p>
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <div className="text-center">
      <div className="flex items-center gap-1.5 justify-center mb-0.5">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-lg font-semibold text-[#1d1d1f] leading-none">{value}</span>
      </div>
      <p className="text-[10px] text-[#6e6e73]">{label}</p>
    </div>
  );
}
