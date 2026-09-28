import { useState } from 'react';
import { ChevronDown, ChevronRight, Truck, Users, Package } from 'lucide-react';
import { RouteData, ColumnConfig } from '../types';
import RouteSummary from './RouteSummary';
import LogisticsTable from './LogisticsTable';

interface RouteAccordionProps {
  route: RouteData;
  columns: ColumnConfig[];
}

export default function RouteAccordion({ route, columns }: RouteAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState('');

  const uniqueClients = Array.from(
    new Set(route.rows.flatMap(r => r.clients.split('|').filter(Boolean)))
  ).sort();

  const filteredRows = clientFilter
    ? route.rows.filter(r => r.clients.includes(clientFilter))
    : route.rows;

  const totalClients = new Set(
    filteredRows.flatMap(r => r.clients.split('|').filter(Boolean))
  ).size;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600 transition-all"
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <Truck size={18} className="text-amber-400" />
        <span className="text-lg font-bold">{route.name}</span>
        
        <div className="flex items-center gap-4 ml-auto text-sm">
          <span className="flex items-center gap-1 text-slate-300">
            <Package size={14} />
            {route.rows.length} рейсов
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <Users size={14} />
            {uniqueClients.length} клиентов
          </span>
          <span className="bg-emerald-600 px-2 py-0.5 rounded text-xs font-bold">
            {route.summary.dohod.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </button>

      {/* Summary when collapsed */}
      {!isOpen && <RouteSummary route={route} />}

      {/* Content when expanded */}
      {isOpen && (
        <div className="bg-white">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Фильтр по клиенту:</label>
              <select
                value={clientFilter}
                onChange={e => setClientFilter(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded text-sm max-w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ВСЕ ({uniqueClients.length})</option>
                {uniqueClients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>
            <div className="ml-auto text-xs text-slate-500">
              Показано: <span className="font-bold text-slate-700">{filteredRows.length}</span> рейсов •{' '}
              <span className="font-bold text-slate-700">{totalClients}</span> клиентов
            </div>
          </div>

          {/* Table */}
          <div className="p-4">
            <LogisticsTable rows={filteredRows} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
}
