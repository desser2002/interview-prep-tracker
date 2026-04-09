import StatusDots from './StatusDots';
import { useLanguage } from '../hooks/useLanguage';

function formatDate(isoString, months) {
  if (!isoString) return null;
  const date = new Date(isoString);
  const now = new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  if (date.getFullYear() === now.getFullYear()) {
    return `${day} ${month}`;
  }
  return `${day} ${month} ${date.getFullYear()}`;
}


export default function QuestionRow({ question, index, onStatusChange }) {
  const { t } = useLanguage();
  const months = t('months');
  const formattedDate = question.status !== 'none' ? formatDate(question.next_review, months) : null;
  const reviewLabel = formattedDate ? t('reviewLabel', formattedDate) : null;

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
            {reviewLabel}
          </span>
        )}
      </span>

      {/* Status dots */}
      <StatusDots status={question.status} onStatusChange={(newStatus) => onStatusChange(index, newStatus)} />
    </li>
  );
}
