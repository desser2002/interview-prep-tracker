const STATUS_CONFIG = {
  fail:    { label: 'Провал',    bg: '#ff3b30', text: '#fff' },
  partial: { label: 'Частично', bg: '#ff9f0a', text: '#fff' },
  done:    { label: 'Усвоено',  bg: '#34c759', text: '#fff' },
};

const STATUS_ORDER = { fail: 0, partial: 1, done: 2 };

function getReviewItems(topics) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const items = [];
  topics.forEach((topic) => {
    topic.questions.forEach((q) => {
      if (q.status === 'none' || !q.next_review) return;
      if (new Date(q.next_review) <= today) {
        items.push({ question: q.text, topic: topic.name, status: q.status });
      }
    });
  });

  return items.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

export default function ReviewPanel({ topics, sidebarWidth = 0 }) {
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
          <span className="text-sm font-semibold text-[#1d1d1f]">Повторить сегодня</span>
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
          const cfg = STATUS_CONFIG[item.status];
          return (
            <div key={i} className="rounded-xl px-3 py-2.5" style={{ background: '#f5f5f7' }}>
              <p className="text-xs font-medium text-[#1d1d1f] leading-snug mb-1.5">
                {item.question}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#6e6e73] truncate">{item.topic}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.text }}
                >
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
