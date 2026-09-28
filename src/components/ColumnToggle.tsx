import { useState } from 'react';
import { Columns, X, Check, Eye, EyeOff } from 'lucide-react';
import { ColumnConfig } from '../types';

interface ColumnToggleProps {
  columns: ColumnConfig[];
  onChange: (columns: ColumnConfig[]) => void;
}

export default function ColumnToggle({ columns, onChange }: ColumnToggleProps) {
  const [open, setOpen] = useState(false);

  const groups: Record<string, string> = {
    basic: 'Основные',
    avg: 'Средние',
    sums: 'Суммы',
    costs: 'Расходы',
    profit: 'Доходность',
    extra: 'Дополнительно',
  };

  const toggle = (key: string) => {
    onChange(columns.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  };

  const toggleGroup = (group: string) => {
    const groupCols = columns.filter(c => c.group === group);
    const allVisible = groupCols.every(c => c.visible);
    onChange(columns.map(c => c.group === group ? { ...c, visible: !allVisible } : c));
  };

  const hiddenCount = columns.filter(c => !c.visible).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-all"
      >
        <Columns size={14} />
        Столбцы
        {hiddenCount > 0 && (
          <span className="bg-indigo-400 text-xs px-1.5 rounded-full">{hiddenCount} скрыто</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 w-72 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b border-slate-200 sticky top-0 bg-white">
            <span className="font-medium text-sm">Настройка столбцов</span>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded">
              <X size={16} />
            </button>
          </div>
          
          {Object.entries(groups).map(([groupKey, groupLabel]) => {
            const groupCols = columns.filter(c => c.group === groupKey);
            const allVisible = groupCols.every(c => c.visible);
            
            return (
              <div key={groupKey} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide"
                >
                  {groupLabel}
                  {allVisible ? <Check size={12} className="text-emerald-600" /> : <EyeOff size={12} className="text-slate-400" />}
                </button>
                {groupCols.map(col => (
                  <button
                    key={col.key}
                    onClick={() => toggle(col.key)}
                    className={`w-full flex items-center justify-between px-4 py-1.5 text-sm hover:bg-slate-50 transition-colors ${
                      col.visible ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <span>{col.label}</span>
                    {col.visible ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-slate-300" />}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
