import { useState, useRef } from 'react';
import { RouteRow, ColumnConfig } from '../types';

interface LogisticsTableProps {
  rows: RouteRow[];
  columns: ColumnConfig[];
}

export default function LogisticsTable({ rows, columns }: LogisticsTableProps) {
  const visibleColumns = columns.filter(c => c.visible);
  const hiddenColumns = columns.filter(c => !c.visible);
  const [tooltip, setTooltip] = useState<{ row: RouteRow; x: number; y: number } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const formatNum = (n: number) => n.toLocaleString('ru-RU');

  const getCellValue = (row: RouteRow, key: string): string => {
    switch (key) {
      case 'date': return row.date;
      case 'day': return row.day;
      case 'time': return row.time;
      case 'queue': return row.queue;
      case 'clients': return String(row.clientsCount);
      case 'avg-day': return row.avgDay.toFixed(2);
      case 'avg-week': return row.avgWeek.toFixed(2);
      case 'sum-route': return formatNum(row.sumRoute);
      case 'sum-day': return formatNum(row.sumDay);
      case 'sum-week': return formatNum(row.sumWeek);
      case 'sum-nds': return formatNum(row.sumNds);
      case 'exp-client': return formatNum(row.expClient);
      case 'exp-route': return formatNum(row.expRoute);
      case 'margin': return formatNum(row.margin);
      case 'cost': return formatNum(row.cost);
      case 'cost-cum': return formatNum(row.costCum);
      case 'dohod': return formatNum(row.dohod);
      case 'dohod-itog': return formatNum(row.dohodItog);
      case 'dohod-cum': return formatNum(row.dohodCum);
      case 'km': return row.km !== null ? String(row.km) : '—';
      case 'time-calc': return row.timeCalc || '—';
      case 'returns': return String(row.returns);
      case 'cancelled': return String(row.cancelled);
      default: return '';
    }
  };

  const getCellClass = (key: string): string => {
    const base = 'px-2 py-1.5 text-xs whitespace-nowrap';
    switch (key) {
      case 'sum-route':
      case 'margin':
      case 'dohod':
        return `${base} font-bold`;
      case 'returns':
        return `${base} text-center`;
      case 'cancelled':
        return `${base} text-center`;
      default:
        return `${base} text-right`;
    }
  };

  const handleRowMouseEnter = (e: React.MouseEvent, row: RouteRow) => {
    if (hiddenColumns.length === 0) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ row, x: rect.right + 10, y: rect.top });
  };

  const handleRowMouseLeave = () => {
    setTooltip(null);
  };

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Пн': return 'bg-blue-50';
      case 'Вт': return 'bg-sky-50';
      case 'Ср': return 'bg-indigo-50';
      case 'Чт': return 'bg-violet-50';
      case 'Пт': return 'bg-purple-50';
      case 'Сб': return 'bg-amber-50';
      case 'Вс': return 'bg-red-50';
      default: return '';
    }
  };

  return (
    <div className="relative" ref={tableRef}>
      <div className="table-wrapper border border-slate-200 rounded-lg shadow-sm">
        <table className="w-full border-collapse min-w-[1200px]">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-30">
            <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
              <th className="px-2 py-2 text-left text-xs font-semibold border-r border-slate-600 w-8">
                №
              </th>
              {visibleColumns.map(col => (
                <th
                  key={col.key}
                  className="px-2 py-2 text-xs font-semibold border-r border-slate-600 whitespace-nowrap text-left"
                >
                  {col.label}
                </th>
              ))}
              {hiddenColumns.length > 0 && (
                <th className="px-2 py-2 text-xs font-semibold bg-slate-600 text-amber-300 whitespace-nowrap">
                  +{hiddenColumns.length} скрытых
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`${getDayColor(row.day)} hover:bg-yellow-50 transition-colors border-b border-slate-100 cursor-default`}
                onMouseEnter={(e) => handleRowMouseEnter(e, row)}
                onMouseLeave={handleRowMouseLeave}
              >
                <td className="px-2 py-1.5 text-xs text-slate-400 border-r border-slate-100">
                  {idx + 1}
                </td>
                {visibleColumns.map(col => (
                  <td
                    key={col.key}
                    className={`${getCellClass(col.key)} border-r border-slate-100`}
                  >
                    {col.key === 'queue' ? (
                      <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-medium" title={row.queue}>
                        {row.queue.replace('-я плановая', '-я пл.')}
                      </span>
                    ) : col.key === 'returns' && row.returns > 0 ? (
                      <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                        {row.returns}
                      </span>
                    ) : (
                      getCellValue(row, col.key)
                    )}
                  </td>
                ))}
                {hiddenColumns.length > 0 && (
                  <td className="px-2 py-1.5 text-xs text-center bg-slate-100 text-slate-400 border-l border-slate-200">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                      наведите
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip for hidden columns */}
      {tooltip && hiddenColumns.length > 0 && (
        <div
          className="fixed z-[200] bg-slate-900 text-white rounded-lg shadow-2xl p-3 pointer-events-none max-w-xs border border-slate-600 tooltip-animate"
          style={{
            left: Math.min(tooltip.x, window.innerWidth - 300),
            top: Math.max(tooltip.y - 50, 10),
          }}
        >
          <div className="text-xs font-bold text-amber-300 mb-2 border-b border-slate-700 pb-1">
            📋 Скрытые данные
          </div>
          <div className="space-y-1">
            {hiddenColumns.map(col => (
              <div key={col.key} className="flex justify-between gap-4 text-xs">
                <span className="text-slate-400">{col.label}:</span>
                <span className="font-medium text-white">{getCellValue(tooltip.row, col.key)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-1 border-t border-slate-700 text-[10px] text-slate-500">
            {tooltip.row.date} • {tooltip.row.queue}
          </div>
        </div>
      )}
    </div>
  );
}
