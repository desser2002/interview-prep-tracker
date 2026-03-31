const STATUSES = [
  { key: 'none',    color: '#c7c7cc', activeColor: '#8e8e93' },
  { key: 'fail',    color: '#ff3b30', activeColor: '#ff3b30' },
  { key: 'partial', color: '#ff9f0a', activeColor: '#ff9f0a' },
  { key: 'done',    color: '#34c759', activeColor: '#34c759' },
];

function formatDate(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  const now = new Date();
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  if (date.getFullYear() === now.getFullYear()) {
    return `${day} ${month}`;
  }
  return `${day} ${month} ${date.getFullYear()}`;
}


export default function QuestionRow({ question, index, onStatusChange }) {
  const reviewLabel = question.status !== 'none' ? formatDate(question.next_review) : null;

  return (
    <li className="flex items-center gap-3 py-1">
      {/* Number */}
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[10px] font-semibold text-[#6e6e73]">
        {index + 1}
      </span>

      {/* Text + date */}
      <span className="flex-1 text-sm text-[#1d1d1f] leading-relaxed min-w-0">
        {question.text}
        {reviewLabel && (
          <span className="ml-2 text-[11px] text-[#b0b0b5] font-normal whitespace-nowrap">
            Повторить: {reviewLabel}
          </span>
        )}
      </span>

      {/* Status dots */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {STATUSES.map((s) => {
          const isActive = question.status === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onStatusChange(index, s.key)}
              title={s.key}
              className="focus:outline-none transition-all duration-150 ease-in-out"
              style={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
                borderRadius: '50%',
                background: isActive ? s.activeColor : s.color,
                opacity: isActive ? 1 : 0.35,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = isActive ? '1' : '0.35'; }}
            />
          );
        })}
      </div>
    </li>
  );
}
