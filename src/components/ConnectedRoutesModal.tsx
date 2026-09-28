import { useState, useEffect } from 'react';
import { X, Link2, Plus, Trash2, Save, Check } from 'lucide-react';
import { RouteData, ConnectedRoute } from '../types';

interface ConnectedRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: RouteData[];
}

function loadConnectedRoutes(): ConnectedRoute[] {
  try {
    const data = localStorage.getItem('connected_routes');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveConnectedRoutes(routes: ConnectedRoute[]) {
  localStorage.setItem('connected_routes', JSON.stringify(routes));
}

export default function ConnectedRoutesModal({ isOpen, onClose, routes }: ConnectedRoutesModalProps) {
  const [connectedRoutes, setConnectedRoutes] = useState<ConnectedRoute[]>(loadConnectedRoutes());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConnectedRoutes(loadConnectedRoutes());
    }
  }, [isOpen]);

  const toggleRouteSelection = (id: string) => {
    setSelectedRouteIds(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!newName.trim() || selectedRouteIds.length < 2) return;
    const newRoute: ConnectedRoute = {
      id: `cr_${Date.now()}`,
      name: newName.trim(),
      routeIds: selectedRouteIds,
      createdAt: new Date().toISOString(),
    };
    const updated = [...connectedRoutes, newRoute];
    setConnectedRoutes(updated);
    saveConnectedRoutes(updated);
    setNewName('');
    setSelectedRouteIds([]);
    setIsCreating(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = connectedRoutes.filter(r => r.id !== id);
    setConnectedRoutes(updated);
    saveConnectedRoutes(updated);
  };

  const getRouteNames = (ids: string[]) => {
    return ids.map(id => routes.find(r => r.id === id)?.name || id).join(' + ');
  };

  const getCombinedStats = (ids: string[]) => {
    const selectedRoutes = routes.filter(r => ids.includes(r.id));
    return {
      totalNds: selectedRoutes.reduce((s, r) => s + r.summary.currentMonthNds, 0),
      totalCost: selectedRoutes.reduce((s, r) => s + r.summary.totalCost, 0),
      totalDohod: selectedRoutes.reduce((s, r) => s + r.summary.dohod, 0),
      totalRows: selectedRoutes.reduce((s, r) => s + r.rows.length, 0),
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
          <div className="flex items-center gap-2">
            <Link2 size={20} />
            <h2 className="text-lg font-bold">Соединённые маршруты</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Existing connected routes */}
          {connectedRoutes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                Сохранённые комбинации
              </h3>
              <div className="space-y-3">
                {connectedRoutes.map(cr => {
                  const stats = getCombinedStats(cr.routeIds);
                  return (
                    <div key={cr.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800">{cr.name}</h4>
                        <button
                          onClick={() => handleDelete(cr.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{getRouteNames(cr.routeIds)}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-blue-50 rounded px-2 py-1">
                          <span className="text-slate-500">Без НДС:</span>
                          <span className="font-bold text-blue-700 ml-1">{stats.totalNds.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="bg-orange-50 rounded px-2 py-1">
                          <span className="text-slate-500">Затраты:</span>
                          <span className="font-bold text-orange-700 ml-1">{stats.totalCost.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="bg-emerald-50 rounded px-2 py-1">
                          <span className="text-slate-500">Доход:</span>
                          <span className="font-bold text-emerald-700 ml-1">{stats.totalDohod.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="bg-purple-50 rounded px-2 py-1">
                          <span className="text-slate-500">Рейсов:</span>
                          <span className="font-bold text-purple-700 ml-1">{stats.totalRows}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Create new */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
            >
              <Plus size={18} />
              Создать новую комбинацию
            </button>
          ) : (
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/50">
              <h3 className="font-semibold text-slate-800 mb-3">Новая комбинация</h3>
              <input
                type="text"
                placeholder="Название комбинации..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p className="text-xs text-slate-500 mb-2">Выберите маршруты для объединения (минимум 2):</p>
              <div className="space-y-2 mb-4">
                {routes.map(route => (
                  <label
                    key={route.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      selectedRouteIds.includes(route.id)
                        ? 'bg-purple-100 border border-purple-300'
                        : 'bg-white border border-slate-200 hover:border-purple-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRouteIds.includes(route.id)}
                      onChange={() => toggleRouteSelection(route.id)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="font-medium text-sm">{route.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">
                      {route.rows.length} рейсов • {route.summary.currentMonthNds.toLocaleString('ru-RU')} ₽
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsCreating(false); setSelectedRouteIds([]); setNewName(''); }}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || selectedRouteIds.length < 2}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} />
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {savedMsg && (
            <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <Check size={16} />
              Сохранено!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
