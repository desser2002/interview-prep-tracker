import { useLocalStorage } from './hooks/useLocalStorage';
import ImportScreen from './components/ImportScreen';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import ProgressBanner from './components/ProgressBanner';
import ReviewPanel from './components/ReviewPanel';

function normalizeQuestion(q) {
  if (typeof q === 'string') {
    return { text: q, status: 'none', changed_at: null, next_review: null };
  }
  return {
    text: q.text ?? '',
    status: q.status ?? 'none',
    changed_at: q.changed_at ?? null,
    next_review: q.next_review ?? null,
  };
}

function normalizeData(parsed) {
  return {
    ...parsed,
    topics: parsed.topics.map((topic) => ({
      ...topic,
      questions: topic.questions.map(normalizeQuestion),
    })),
  };
}

function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview-prep-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [rawData, setData] = useLocalStorage('interview-prep-data', null);
  const data = rawData ? normalizeData(rawData) : null;

  const handleImport = (parsed) => {
    setData(normalizeData(parsed));
  };

  const handleReset = () => {
    setData(null);
  };

  const handleExport = () => {
    exportData(data);
  };

  const handleStatusChange = (topicIndex, questionIndex, newStatus) => {
    const REVIEW_DAYS = { fail: 1, partial: 2, done: 7 };

    const updated = {
      ...data,
      topics: data.topics.map((topic, ti) => {
        if (ti !== topicIndex) return topic;
        return {
          ...topic,
          questions: topic.questions.map((q, qi) => {
            if (qi !== questionIndex) return q;
            const isToggleOff = q.status === newStatus;
            const resolvedStatus = isToggleOff ? 'none' : newStatus;

            if (resolvedStatus === 'none') {
              return { ...q, status: 'none', changed_at: null, next_review: null };
            }

            const now = new Date();
            const review = new Date(now);
            review.setDate(review.getDate() + REVIEW_DAYS[resolvedStatus]);

            return {
              ...q,
              status: resolvedStatus,
              changed_at: now.toISOString(),
              next_review: review.toISOString(),
            };
          }),
        };
      }),
    };
    setData(updated);
  };

  if (!data) {
    return <ImportScreen onImport={handleImport} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f7' }}>
      <Header topics={data.topics} onReset={handleReset} onExport={handleExport} />
      <ReviewPanel topics={data.topics} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <ProgressBanner topics={data.topics} />
        {data.topics.map((topic, index) => (
          <TopicCard
            key={index}
            topic={topic}
            index={index}
            onStatusChange={handleStatusChange}
          />
        ))}
      </main>
    </div>
  );
}
