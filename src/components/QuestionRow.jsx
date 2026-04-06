import StatusDots from './StatusDots';

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
      <StatusDots status={question.status} onStatusChange={(newStatus) => onStatusChange(index, newStatus)} />
    </li>
  );
}
