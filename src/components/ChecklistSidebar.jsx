import { useState, useRef } from 'react';
import { Menu, ChevronLeft, Trash2, Plus, FileJson, AlertCircle, Download } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

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

function normalizeImported(parsed) {
  return {
    ...parsed,
    topics: parsed.topics.map((topic) => ({
      ...topic,
      questions: topic.questions.map(normalizeQuestion),
    })),
  };
}

function AddChecklistModal({ onAdd, onClose }) {
  const { t } = useLanguage();
  const [step, setStep] = useState('import');
  const [parsedData, setParsedData] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const parseFile = (file) => {
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.topics || !Array.isArray(data.topics)) {
          setError(t('errorInvalidFormat'));
          return;
        }
        setParsedData(normalizeImported(data));
        setStep('name');
      } catch {
        setError(t('errorReadFailed'));
      }
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(parsedData, trimmed);
    onClose();
  };

  const totalQuestions = parsedData
    ? parsedData.topics.reduce((sum, topic) => sum + topic.questions.length, 0)
    : 0;

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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 24,
          width: '100%',
          maxWidth: 420,
          margin: '0 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {step === 'import' ? (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: '0 0 16px' }}>
              {t('addChecklist')}
            </h2>

            <div
              onDrop={(e) => { e.preventDefault(); setDragging(false); parseFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              style={{
                borderRadius: 14,
                border: `2px dashed ${dragging ? '#0071e3' : 'rgba(0,0,0,0.12)'}`,
                background: dragging ? '#eff6ff' : '#f5f5f7',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: '32px 24px',
                transition: 'all 200ms ease',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: dragging ? '#0071e3' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  transition: 'background 200ms ease',
                }}
              >
                <FileJson style={{ width: 20, height: 20, color: dragging ? '#fff' : '#6e6e73' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1d1d1f', margin: '0 0 2px' }}>
                  {dragging ? t('dropRelease') : t('dropInstruction')}
                </p>
                <p style={{ fontSize: 12, color: '#6e6e73', margin: 0 }}>
                  {t('dropClickHint')}
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".json,application/json"
                onChange={(e) => parseFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

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
                  padding: '10px',
                  borderRadius: 10,
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
                onClick={() => inputRef.current?.click()}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0071e3',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                {t('selectFile')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: '0 0 4px' }}>
              {t('checklistName')}
            </h2>
            <p style={{ fontSize: 13, color: '#6e6e73', margin: '0 0 16px' }}>
              {t('topicsCount', parsedData.topics.length)} · {t('questionsCount', totalQuestions)}
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              placeholder={t('namePlaceholder')}
              autoFocus
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#f5f5f7',
                fontSize: 14,
                color: '#1d1d1f',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setStep('import')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#6e6e73',
                  cursor: 'pointer',
                }}
              >
                {t('back')}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!name.trim()}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0071e3',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#fff',
                  cursor: name.trim() ? 'pointer' : 'default',
                  opacity: name.trim() ? 1 : 0.4,
                  transition: 'opacity 150ms ease',
                }}
              >
                {t('add')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ChecklistSidebar({
  checklists,
  activeId,
  isOpen,
  onToggle,
  onSelect,
  onDelete,
  onAdd,
  onExportAll,
}) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const checklist = checklists.find((c) => c.id === id);
    if (window.confirm(t('deleteConfirm', checklist?.name))) {
      onDelete(id);
    }
  };

  return (
    <>
      <div
        style={{
          width: isOpen ? 260 : 48,
          height: '100vh',
          background: '#e8e8ed',
          borderRight: '1px solid rgba(0,0,0,0.1)',
          transition: 'width 250ms ease',
          overflow: 'hidden',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 20,
        }}
      >
        {/* Toggle + title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'space-between' : 'center',
            padding: '0 8px',
            height: 65,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            flexShrink: 0,
            gap: 8,
          }}
        >
          {isOpen && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1d1d1f',
                whiteSpace: 'nowrap',
                paddingLeft: 4,
                overflow: 'hidden',
              }}
            >
              {t('myChecklists')}
            </span>
          )}
          <button
            onClick={onToggle}
            title={isOpen ? t('collapse') : t('expand')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6e6e73',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.07)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {isOpen ? (
              <ChevronLeft style={{ width: 16, height: 16 }} />
            ) : (
              <Menu style={{ width: 16, height: 16 }} />
            )}
          </button>
        </div>

        {/* Checklist list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 150ms ease',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {checklists.map((checklist) => {
            const isActive = checklist.id === activeId;
            const isHovered = hoveredId === checklist.id;

            return (
              <div
                key={checklist.id}
                onClick={() => onSelect(checklist.id)}
                onMouseEnter={() => setHoveredId(checklist.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 10px',
                  borderRadius: 10,
                  marginBottom: 2,
                  cursor: 'pointer',
                  background: isActive
                    ? '#0071e3'
                    : isHovered
                    ? 'rgba(0,0,0,0.06)'
                    : 'transparent',
                  transition: 'background 150ms ease',
                  minWidth: 0,
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#fff' : '#1d1d1f',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      margin: 0,
                    }}
                  >
                    {checklist.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: isActive ? 'rgba(255,255,255,0.7)' : '#6e6e73',
                      margin: '2px 0 0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {checklist.topics.length} {t('topicWord', checklist.topics.length)}
                  </p>
                </div>

                {isHovered && (
                  <button
                    onClick={(e) => handleDelete(e, checklist.id)}
                    title={t('deleteTitle')}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border: 'none',
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginLeft: 6,
                      color: isActive ? 'rgba(255,255,255,0.9)' : '#6e6e73',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = isActive
                        ? 'rgba(255,255,255,0.35)'
                        : 'rgba(255,59,48,0.12)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isActive
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.08)')
                    }
                  >
                    <Trash2 style={{ width: 12, height: 12 }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add button + Export All button */}
        <div
          style={{
            padding: '10px 8px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            flexShrink: 0,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 150ms ease',
            pointerEvents: isOpen ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 10,
              border: 'none',
              background: 'rgba(0,113,227,0.1)',
              color: '#0071e3',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,113,227,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,113,227,0.1)')}
          >
            <Plus style={{ width: 14, height: 14 }} />
            {t('addChecklist')}
          </button>
          <button
            onClick={onExportAll}
            disabled={checklists.length === 0}
            title={t('exportAllTitle')}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 10,
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              color: '#6e6e73',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: checklists.length === 0 ? 'default' : 'pointer',
              opacity: checklists.length === 0 ? 0.4 : 1,
              transition: 'background 150ms ease, opacity 150ms ease',
            }}
            onMouseEnter={(e) => {
              if (checklists.length > 0) e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              if (checklists.length > 0) e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            {t('exportAll')}
          </button>
        </div>
      </div>

      {showModal && (
        <AddChecklistModal onAdd={onAdd} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
