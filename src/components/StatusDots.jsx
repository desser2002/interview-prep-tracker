import { useLanguage } from '../hooks/useLanguage';

export default function StatusDots({ status, onStatusChange }) {
  const { t } = useLanguage();

  const STATUSES = [
    { key: 'none',    color: '#c7c7cc', activeColor: '#8e8e93', label: t('statusNone') },
    { key: 'fail',    color: '#ff3b30', activeColor: '#ff3b30', label: t('statusFail') },
    { key: 'partial', color: '#ff9f0a', activeColor: '#ff9f0a', label: t('statusPartial') },
    { key: 'done',    color: '#34c759', activeColor: '#34c759', label: t('statusDone') },
  ];

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {STATUSES.map((s) => {
        const isActive = status === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onStatusChange(s.key)}
            title={s.label}
            aria-label={s.label}
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
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = isActive ? '1' : '0.35';
            }}
          />
        );
      })}
    </div>
  );
}
