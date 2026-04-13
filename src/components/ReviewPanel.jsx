import { useState } from 'react';
import StatusDots from './StatusDots';
import { useLanguage } from '../hooks/useLanguage';

const STATUS_ORDER = { fail: 0, partial: 1, done: 2 };
const REVIEW_STATUSES = ['fail', 'partial', 'done'];
const STATUS_META = {
  fail: { color: '#ff3b30', labelKey: 'statusFail' },
  partial: { color: '#ff9f0a', labelKey: 'statusPartial' },
  done: { color: '#34c759', labelKey: 'statusDone' },
};

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

export default function ReviewPanel({ topics, onStatusChange, onPostponeReview, sidebarWidth = 0 }) {
  const { t } = useLanguage();
  const items = getReviewItems(topics);
  const [days, setDays] = useState('1');
  const [isPostponeOpen, setIsPostponeOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({
    fail: false,
    partial: false,
    done: false,
  });

  if (items.length === 0) return null;

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const handlePostpone = () => {
    const selected = REVIEW_STATUSES.filter((status) => selectedStatuses[status]);
    const parsedDays = Number(days);
    if (selected.length === 0 || !Number.isInteger(parsedDays) || parsedDays <= 0) return;
    onPostponeReview(selected, parsedDays);
    setIsPostponeOpen(false);
  };

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
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1d1d1f]">{t('reviewToday')}</span>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: '#ff3b3015', color: '#ff3b30' }}
            >
              {items.length}
            </span>
            <button
              type="button"
              onClick={() => setIsPostponeOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#0071e3] hover:bg-[#f5f5f7] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-1"
              style={{ border: '1px solid rgba(0,113,227,0.25)' }}
            >
              {t('reviewPostponeButton')}
              <span
                className="text-[10px] leading-none"
                style={{ transform: isPostponeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
              >
                ▾
              </span>
            </button>
          </div>
        </div>

        {isPostponeOpen && (
          <div className="mt-3 rounded-xl p-3 space-y-3" style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div>
              <div className="text-[11px] text-[#6e6e73] mb-1.5">{t('reviewPostponeForStatuses')}</div>
              <div className="flex items-center gap-2">
                {REVIEW_STATUSES.map((status) => {
                  const isSelected = selectedStatuses[status];
                  const meta = STATUS_META[status];
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleStatus(status)}
                      aria-label={t(meta.labelKey)}
                      title={t(meta.labelKey)}
                      className="focus:outline-none transition-all duration-150 ease-in-out"
                      style={{
                        width: isSelected ? 12 : 8,
                        height: isSelected ? 12 : 8,
                        borderRadius: '50%',
                        background: meta.color,
                        opacity: isSelected ? 1 : 0.35,
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-16 px-2.5 py-1.5 text-xs rounded-full border border-[rgba(0,0,0,0.15)] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
              <span className="text-[11px] text-[#6e6e73]">{t('reviewPostponeByDays')}</span>
              <button
                type="button"
                onClick={handlePostpone}
                className="ml-auto px-3 py-1.5 rounded-full text-xs font-semibold text-[#0071e3] hover:bg-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-1"
                style={{ border: '1px solid rgba(0,113,227,0.25)', background: '#fff' }}
              >
                {t('reviewPostponeApply')}
              </button>
            </div>
          </div>
        )}
      </div>

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
