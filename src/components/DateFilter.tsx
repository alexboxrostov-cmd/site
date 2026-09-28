import { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

interface DateFilterProps {
  onApply: (from: string, to: string) => void;
}

export default function DateFilter({ onApply }: DateFilterProps) {
  const [activeRange, setActiveRange] = useState('month');
  const [showPopup, setShowPopup] = useState(false);
  const [dateFrom, setDateFrom] = useState('2026-09-01');
  const [dateTo, setDateTo] = useState('2026-09-28');

  const ranges = [
    { key: 'week', label: 'Неделя' },
    { key: '2weeks', label: '2 недели' },
    { key: 'month', label: 'Текущий месяц' },
    { key: '2months', label: '2 месяца' },
    { key: '3months', label: '3 месяца' },
  ];

  const handleRangeClick = (key: string) => {
    setActiveRange(key);
    const now = new Date(2026, 8, 28);
    let from = new Date(now);
    switch (key) {
      case 'week': from.setDate(now.getDate() - 7); break;
      case '2weeks': from.setDate(now.getDate() - 14); break;
      case 'month': from = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case '2months': from.setMonth(now.getMonth() - 2); break;
      case '3months': from.setMonth(now.getMonth() - 3); break;
    }
    setDateFrom(from.toISOString().split('T')[0]);
    setDateTo(now.toISOString().split('T')[0]);
  };

  const formatLabel = () => {
    const f = dateFrom.split('-').reverse().join('.');
    const t = dateTo.split('-').reverse().join('.');
    return `${f} — ${t}`;
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 shadow-lg border-b border-slate-700">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium mr-2">📅 Период:</span>
        
        {ranges.map(r => (
          <button
            key={r.key}
            onClick={() => handleRangeClick(r.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              activeRange === r.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {r.label}
          </button>
        ))}

        <div className="relative ml-2">
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 rounded text-sm hover:bg-slate-600 transition-all"
          >
            <Calendar size={14} />
            <span>{formatLabel()}</span>
            <span className="text-xs">▼</span>
          </button>

          {showPopup && (
            <div className="absolute top-full mt-2 right-0 bg-white text-slate-800 rounded-lg shadow-xl p-4 z-50 min-w-[250px] border border-slate-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-8">С:</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-8">По:</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <p className="text-xs text-slate-500">Максимум 4 месяца за раз</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => { onApply(dateFrom, dateTo); setShowPopup(false); }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onApply(dateFrom, dateTo)}
          className="ml-2 flex items-center gap-1 px-3 py-1.5 bg-emerald-600 rounded text-sm font-medium hover:bg-emerald-700 transition-all"
        >
          <RefreshCw size={14} />
          Обновить
        </button>
      </div>
    </div>
  );
}
