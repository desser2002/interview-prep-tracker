import StatusDots from './StatusDots';
import { useLanguage } from '../hooks/useLanguage';

const STATUS_ORDER = { fail: 0, partial: 1, done: 2 };

function getReviewItems(topics) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const items = [];
  topics.forEach((topic, topicIndex) => {
    topic.questions.forEach((q, questionIndex) => {
      if (q.status === 'none' || !q.next_review) return;
      if (new Date(q.next_review) <= today) {
        items.push({
          question: q.text,
          topic: topic.name,
          status: q.status,
          topicIndex,
          questionIndex,
        });
      }
    });
  });

  return items.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

export default function ReviewPanel({ topics, onStatusChange, sidebarWidth = 0 }) {
  const { t } = useLanguage();
  const items = getReviewItems(topics);

  if (items.length === 0) return null;

  return (
    <div
      className="flex flex-col"
      style={{
        position: 'fixed',
        top: 104,
        left: `calc(50% + ${sidebarWidth / 2}px + 384px + 20px)`,
        transition: 'left 250ms ease',
        width: 272,
        maxHeight: 'calc(100vh - 116px)',
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1d1d1f]">{t('reviewToday')}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: '#ff3b3015', color: '#ff3b30' }}
          >
            {items.length}
          </span>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 px-3 py-3 space-y-2">
        {items.map((item, i) => {
          return (
            <div key={i} className="rounded-xl px-3 py-2.5" style={{ background: '#f5f5f7' }}>
              <p className="text-xs font-medium text-[#1d1d1f] leading-snug mb-1.5">
                {item.question}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#6e6e73] truncate">{item.topic}</span>
                <StatusDots
                  status={item.status}
                  onStatusChange={(newStatus) => onStatusChange(item.topicIndex, item.questionIndex, newStatus)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
