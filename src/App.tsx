import { useState } from 'react';
import { Link2 } from 'lucide-react';
import DateFilter from './components/DateFilter';
import RouteAccordion from './components/RouteAccordion';
import ColumnToggle from './components/ColumnToggle';
import ConnectedRoutesModal from './components/ConnectedRoutesModal';
import { routesData, defaultColumns } from './data/mockData';
import { ColumnConfig } from './types';

export default function App() {
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [showConnectedModal, setShowConnectedModal] = useState(false);

  const handleDateApply = (from: string, to: string) => {
    console.log('Date range:', from, to);
  };

  const hiddenCount = columns.filter(c => !c.visible).length;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sticky Date Filter */}
      <DateFilter onApply={handleDateApply} />

      {/* Toolbar */}
      <div className="sticky top-[52px] z-40 bg-white border-b border-slate-200 shadow-sm px-4 py-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800">📊 Отчёт по логистике</h1>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {routesData.length} маршрутов
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {hiddenCount > 0 && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                💡 {hiddenCount} столбцов скрыто — наведите на строку для просмотра
              </span>
            )}
            
            <button
              onClick={() => setShowConnectedModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
            >
              <Link2 size={14} />
              Соединённые маршруты
            </button>

            <ColumnToggle columns={columns} onChange={setColumns} />
          </div>
        </div>
      </div>

      {/* Routes */}
      <div className="p-4 space-y-4 max-w-[1800px] mx-auto">
        {routesData.map(route => (
          <RouteAccordion key={route.id} route={route} columns={columns} />
        ))}
      </div>

      {/* Connected Routes Modal */}
      <ConnectedRoutesModal
        isOpen={showConnectedModal}
        onClose={() => setShowConnectedModal(false)}
        routes={routesData}
      />
    </div>
  );
}
