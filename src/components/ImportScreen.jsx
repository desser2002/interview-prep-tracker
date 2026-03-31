import { useRef, useState } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';

export default function ImportScreen({ onImport }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const parseFile = (file) => {
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.topics || !Array.isArray(data.topics)) {
          setError('Неверный формат: ожидается объект с полем "topics" (массив).');
          return;
        }
        onImport(data);
      } catch {
        setError('Не удалось прочитать файл. Убедитесь, что это валидный JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => parseFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    parseFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo / Title */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0071e3] mb-6 shadow-lg">
          <FileJson className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
          Interview Prep Tracker
        </h1>
        <p className="text-[#6e6e73] text-lg font-normal">
          Импортируйте список тем и начните подготовку
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-full max-w-md cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-200 ease-in-out
          flex flex-col items-center justify-center gap-4 py-14 px-8
          ${dragging
            ? 'border-[#0071e3] bg-blue-50 scale-[1.02]'
            : 'border-[rgba(0,0,0,0.12)] bg-white hover:border-[#0071e3] hover:shadow-md'
          }
        `}
        style={{ boxShadow: dragging ? '0 8px 30px rgba(0,113,227,0.15)' : '0 2px 12px rgba(0,0,0,0.08)' }}
      >
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200
          ${dragging ? 'bg-[#0071e3]' : 'bg-[#f5f5f7]'}
        `}>
          <Upload className={`w-6 h-6 transition-colors duration-200 ${dragging ? 'text-white' : 'text-[#6e6e73]'}`} />
        </div>

        <div className="text-center">
          <p className="text-[#1d1d1f] font-medium text-base mb-1">
            {dragging ? 'Отпустите файл' : 'Перетащите JSON-файл'}
          </p>
          <p className="text-[#6e6e73] text-sm">
            или нажмите чтобы выбрать
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Primary button */}
      <button
        onClick={() => inputRef.current?.click()}
        className="
          mt-5 px-8 py-3 rounded-full
          bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006edb]
          text-white font-medium text-base
          transition-all duration-200 ease-in-out
          shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2
        "
      >
        Импортировать JSON
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 max-w-md w-full bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Format hint */}
      <div className="mt-10 max-w-md w-full">
        <p className="text-xs text-[#6e6e73] text-center mb-3 uppercase tracking-wider font-medium">
          Ожидаемый формат
        </p>
        <pre className="bg-white rounded-2xl px-5 py-4 text-xs text-[#1d1d1f] overflow-x-auto leading-relaxed"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
{`{
  "topics": [
    {
      "name": "OOP",
      "questions": [
        "4 принципа: encapsulation...",
        "Interface vs abstract class"
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
