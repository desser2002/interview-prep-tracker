import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import QuestionRow from './QuestionRow';
import { useLanguage } from '../hooks/useLanguage';

export default function TopicCard({ topic, index, onStatusChange }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const count = topic.questions.length;
  const doneCount    = topic.questions.filter((q) => q.status === 'done').length;
  const partialCount = topic.questions.filter((q) => q.status === 'partial').length;
  const failCount    = topic.questions.filter((q) => q.status === 'fail').length;
  const percent = count > 0 ? Math.round((doneCount / count) * 100) : 0;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left group focus:outline-none"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Number badge */}
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-xs font-semibold text-[#6e6e73] group-hover:bg-[#e8e8ed] transition-colors duration-200">
            {index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-[#1d1d1f] leading-tight">
              {topic.name}
            </h2>
            <p className="text-xs text-[#6e6e73] mt-0.5">
              {t('questionCount', count)}
            </p>

            {/* Progress bar */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full overflow-hidden flex gap-px" style={{ background: 'rgba(0,0,0,0.07)' }}>
                {[
                  { status: 'fail',    count: failCount,    color: '#ff3b30' },
                  { status: 'partial', count: partialCount, color: '#ff9f0a' },
                  { status: 'done',    count: doneCount,    color: '#34c759' },
                ].map(({ status, count: c, color }) => {
                  const w = count > 0 ? (c / count) * 100 : 0;
                  if (w === 0) return null;
                  return (
                    <div
                      key={status}
                      className="h-full transition-all duration-500 ease-out"
                      style={{ width: `${w}%`, background: color }}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] font-medium text-[#6e6e73] flex-shrink-0 w-7 text-right">
                {percent}%
              </span>
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-[#6e6e73] flex-shrink-0 ml-4 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Questions list */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5">
          <div className="h-px w-full mb-4" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <ul className="space-y-2">
            {topic.questions.map((question, i) => (
              <QuestionRow
                key={i}
                question={question}
                index={i}
                onStatusChange={(qIndex, newStatus) => onStatusChange(index, qIndex, newStatus)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
