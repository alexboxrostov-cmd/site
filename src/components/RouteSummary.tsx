import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { RouteData } from '../types';

interface RouteSummaryProps {
  route: RouteData;
}

export default function RouteSummary({ route }: RouteSummaryProps) {
  const { summary } = route;
  const monthDiff = summary.currentMonthNds - summary.prevMonthNds;
  const monthPct = summary.prevMonthNds > 0 
    ? ((monthDiff / summary.prevMonthNds) * 100).toFixed(1) 
    : '0';
  const isGrowth = monthDiff >= 0;

  const formatNum = (n: number) => n.toLocaleString('ru-RU');

  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-slate-50 border-t border-slate-200">
      {/* Текущий месяц */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200">
        <DollarSign size={16} className="text-blue-600" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Без НДС (тек. мес.)</div>
          <div className="text-sm font-bold text-slate-800">{formatNum(summary.currentMonthNds)} ₽</div>
        </div>
      </div>

      {/* Предыдущий месяц */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200">
        <DollarSign size={16} className="text-slate-400" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Без НДС (пред. мес.)</div>
          <div className="text-sm font-bold text-slate-600">{formatNum(summary.prevMonthNds)} ₽</div>
        </div>
      </div>

      {/* Динамика */}
      <div className={`flex items-center gap-1 rounded-lg px-3 py-2 shadow-sm border ${
        isGrowth ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
      }`}>
        {isGrowth ? <TrendingUp size={16} className="text-emerald-600" /> : <TrendingDown size={16} className="text-red-600" />}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Динамика</div>
          <div className={`text-sm font-bold ${isGrowth ? 'text-emerald-700' : 'text-red-700'}`}>
            {isGrowth ? '+' : ''}{monthPct}%
          </div>
        </div>
      </div>

      {/* Затраты */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200">
        <Wallet size={16} className="text-orange-600" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Затраты итого</div>
          <div className="text-sm font-bold text-orange-700">{formatNum(summary.totalCost)} ₽</div>
        </div>
      </div>

      {/* Доходность */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-emerald-200">
        <TrendingUp size={16} className="text-emerald-600" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Доходность</div>
          <div className="text-sm font-bold text-emerald-700">{formatNum(summary.dohod)} ₽</div>
        </div>
      </div>
    </div>
  );
}
