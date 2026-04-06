import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import ImportScreen from './components/ImportScreen';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import ProgressBanner from './components/ProgressBanner';
import ReviewPanel from './components/ReviewPanel';
import ChecklistSidebar from './components/ChecklistSidebar';

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

// Runs once synchronously during first render to migrate old localStorage format
function migrateOrEmpty() {
  try {
    const oldData = localStorage.getItem('interview-prep-data');
    if (oldData) {
      const parsed = JSON.parse(oldData);
      if (parsed?.topics && Array.isArray(parsed.topics)) {
        const id = crypto.randomUUID();
        const migrated = [
          {
            id,
            name: 'Мой чеклист',
            created_at: new Date().toISOString(),
            topics: normalizeData(parsed).topics,
          },
        ];
        localStorage.setItem('active_checklist_id', JSON.stringify(id));
        localStorage.removeItem('interview-prep-data');
        return migrated;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

function exportChecklist(checklist) {
  const blob = new Blob([JSON.stringify({ topics: checklist.topics }, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${checklist.name}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAllChecklists(checklists) {
  const data = checklists.map((c) => ({ name: c.name, topics: c.topics }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `all-checklists-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [checklists, setChecklists] = useLocalStorage('checklists', migrateOrEmpty);
  const [activeId, setActiveId] = useLocalStorage('active_checklist_id', null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeChecklist =
    checklists.find((c) => c.id === activeId) ?? checklists[0] ?? null;

  const handleAddChecklist = (parsedData, name) => {
    const id = crypto.randomUUID();
    const newChecklist = {
      id,
      name,
      created_at: new Date().toISOString(),
      topics: parsedData.topics,
    };
    setChecklists([...checklists, newChecklist]);
    setActiveId(id);
  };

  const handleDeleteChecklist = (id) => {
    const updated = checklists.filter((c) => c.id !== id);
    setChecklists(updated);
    if (id === activeId || !updated.find((c) => c.id === activeId)) {
      setActiveId(updated[0]?.id ?? null);
    }
  };

  const handleExport = () => {
    if (activeChecklist) exportChecklist(activeChecklist);
  };

  const handleStatusChange = (topicIndex, questionIndex, newStatus) => {
    if (!activeChecklist) return;
    const REVIEW_DAYS = { fail: 1, partial: 2, done: 7 };

    setChecklists(
      checklists.map((c) => {
        if (c.id !== activeChecklist.id) return c;
        return {
          ...c,
          topics: c.topics.map((topic, ti) => {
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
      })
    );
  };

  if (checklists.length === 0) {
    return <ImportScreen onImport={handleAddChecklist} />;
  }

  const sidebarWidth = sidebarOpen ? 260 : 48;
  const topics = activeChecklist?.topics ?? [];

  return (
    <div style={{ display: 'flex', background: '#f5f5f7', minHeight: '100vh' }}>
      <ChecklistSidebar
        checklists={checklists}
        activeId={activeChecklist?.id}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onSelect={setActiveId}
        onDelete={handleDeleteChecklist}
        onAdd={handleAddChecklist}
        onExportAll={() => exportAllChecklists(checklists)}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Header name={activeChecklist?.name} topics={topics} onExport={handleExport} />
        <ReviewPanel topics={topics} onStatusChange={handleStatusChange} sidebarWidth={sidebarWidth} />

        <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <ProgressBanner topics={topics} />
          {topics.map((topic, index) => (
            <TopicCard
              key={index}
              topic={topic}
              index={index}
              onStatusChange={handleStatusChange}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
