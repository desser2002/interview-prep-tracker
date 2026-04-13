import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLanguage } from './hooks/useLanguage';
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

function parseQuestionsInput(rawInput) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { questions: [], parsedTopicName: null };
  }

  const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');
  if (!looksLikeJson) {
    const questions = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return { questions, parsedTopicName: null };
  }

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error('INVALID_JSON');
  }
  const rawQuestions = Array.isArray(parsed) ? parsed : parsed?.questions;
  const hasNameField = !Array.isArray(parsed) && typeof parsed?.name === 'string';
  const parsedTopicName = hasNameField ? parsed.name.trim() : null;

  if (!Array.isArray(rawQuestions)) {
    throw new Error('INVALID_FORMAT');
  }

  const questions = rawQuestions
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object' && typeof item.text === 'string') return item.text.trim();
      return '';
    })
    .filter(Boolean);

  return { questions, parsedTopicName };
}

function AddTopicModal({ onAdd, onClose }) {
  const { t } = useLanguage();
  const [topicName, setTopicName] = useState('');
  const [questionsInput, setQuestionsInput] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    const nameFromInput = topicName.trim();
    if (!questionsInput.trim()) {
      setError(t('addTopicQuestionsRequired'));
      return;
    }

    try {
      const { questions, parsedTopicName } = parseQuestionsInput(questionsInput);
      const resolvedName = nameFromInput || parsedTopicName || '';

      if (!resolvedName) {
        setError(t('addTopicNameRequired'));
        return;
      }
      if (questions.length === 0) {
        setError(t('addTopicQuestionsRequired'));
        return;
      }

      onAdd(resolvedName, questions);
      onClose();
    } catch (err) {
      if (err?.message === 'INVALID_JSON') {
        setError(t('addTopicInvalidJson'));
        return;
      }
      if (err?.message === 'INVALID_FORMAT') {
        setError(t('addTopicInvalidStructure'));
        return;
      }
      setError(t('addTopicFormatError'));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 24,
          width: '100%',
          maxWidth: 460,
          margin: '0 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: '0 0 14px' }}>
          {t('addTopicTitle')}
        </h2>

        <label
          htmlFor="topic-name-input"
          style={{ display: 'block', fontSize: 13, color: '#6e6e73', marginBottom: 6 }}
        >
          {t('topicNameField')}
        </label>
        <input
          id="topic-name-input"
          type="text"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          placeholder={t('topicNamePlaceholder')}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.12)',
            background: '#fff',
            fontSize: 14,
            color: '#1d1d1f',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        />

        <label
          htmlFor="questions-input"
          style={{ display: 'block', fontSize: 13, color: '#6e6e73', marginBottom: 6 }}
        >
          {t('questionsInputField')}
        </label>
        <textarea
          id="questions-input"
          value={questionsInput}
          onChange={(e) => setQuestionsInput(e.target.value)}
          placeholder={t('questionsInputPlaceholder')}
          rows={8}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.12)',
            background: '#fff',
            fontSize: 14,
            color: '#1d1d1f',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        />

        <p style={{ fontSize: 12, color: '#6e6e73', margin: '12px 0 0', whiteSpace: 'pre-line' }}>
          {t('addTopicFormatHint')}
        </p>

        {error && (
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              background: '#fff0f0',
              border: '1px solid #ffd0d0',
              borderRadius: 10,
              padding: '10px 14px',
            }}
          >
            <AlertCircle style={{ width: 15, height: 15, color: '#ff3b30', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#c0392b', margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'transparent',
              fontSize: 14,
              fontWeight: 500,
              color: '#6e6e73',
              cursor: 'pointer',
            }}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 999,
              border: 'none',
              background: '#0071e3',
              fontSize: 14,
              fontWeight: 500,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {t('addTopicButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();
  const [checklists, setChecklists] = useLocalStorage('checklists', migrateOrEmpty);
  const [activeId, setActiveId] = useLocalStorage('active_checklist_id', null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);

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

  const handleAddTopic = (name, questions) => {
    if (!activeChecklist) return;

    const topicToAdd = {
      name,
      questions: questions.map(normalizeQuestion),
    };

    setChecklists(
      checklists.map((c) => (
        c.id === activeChecklist.id
          ? { ...c, topics: [...c.topics, topicToAdd] }
          : c
      ))
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
          <div className="pt-1 flex justify-center">
            <button
              onClick={() => setShowAddTopicModal(true)}
              className="
                px-5 py-2.5 rounded-full
                bg-white hover:bg-[#fafafa]
                text-[#0071e3] font-medium text-sm
                transition-all duration-200 ease-in-out
                border border-[rgba(0,113,227,0.25)]
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-1
              "
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
            >
              <Plus className="w-4 h-4" />
              {t('addTopicButton')}
            </button>
          </div>
        </main>
      </div>
      {showAddTopicModal && (
        <AddTopicModal
          onAdd={handleAddTopic}
          onClose={() => setShowAddTopicModal(false)}
        />
      )}
    </div>
  );
}
