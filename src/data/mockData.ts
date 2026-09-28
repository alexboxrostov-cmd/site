import { RouteData, ColumnConfig } from '../types';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const queues = ['1-я плановая', '2-я плановая', '3-я плановая'];
const clientNames = [
  'БЕЛЫЙ С.В. ИП (АЗОВ) (Парковый,1)',
  'ГОТФРИД В.К. ИП (АЗОВ) (Кагальницкое шоссе, 30А)',
  'ГРИБАНОВ А.В. ИП (АЗОВ) (Кагальницкое шоссе, 15/1)',
  'СЮСЮРА О.В. ИП (АЗОВ) (Московская,102)',
  'ШЕВЧЕНКО А.А. ИП (АЗОВ) (Кагальницкое, 22В)',
  'ТУРОМШИН С.В. ИП (АЗОВ) (Промышленная,2)',
  'НЕДОРУБ П.Н. ИП (АЗОВ) (Московская,115)',
  'ОВСЮКОВ А.А. ИП (АЗОВ) (Объездной 8)',
];

function generateRows(routeName: string, count: number) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const dayIdx = i % 7;
    const date = new Date(2026, 8, 1 + Math.floor(i / 3));
    const clientsCount = 7 + Math.floor(Math.random() * 5);
    const sumRoute = 20000 + Math.floor(Math.random() * 100000);
    const cost = 1500 + Math.floor(Math.random() * 1000);
    const sumNds = Math.floor(sumRoute * 0.82);
    const margin = sumRoute - cost;
    const dohod = Math.floor(margin * 0.15);

    rows.push({
      id: `row_${routeName}_${i}`,
      date: `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`,
      day: days[dayIdx],
      time: `${String(5 + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      queue: queues[i % 3],
      clientsCount,
      avgDay: +(clientsCount + Math.random() * 2).toFixed(2),
      avgWeek: +(clientsCount - 1 + Math.random() * 2).toFixed(2),
      sumRoute,
      sumDay: sumRoute + Math.floor(Math.random() * 50000),
      sumWeek: sumRoute * 3 + Math.floor(Math.random() * 100000),
      sumNds,
      expClient: 0,
      expRoute: cost,
      margin,
      cost,
      costCum: 0,
      dohod,
      dohodItog: 0,
      dohodCum: 0,
      km: Math.random() > 0.5 ? 45 + Math.floor(Math.random() * 60) : null,
      timeCalc: Math.random() > 0.5 ? `${1 + Math.floor(Math.random() * 3)}ч ${Math.floor(Math.random() * 50)}м` : null,
      returns: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
      cancelled: 0,
      clients: clientNames.slice(0, clientsCount).join('|'),
      clientSums: clientNames.slice(0, clientsCount).map(() => (1000 + Math.floor(Math.random() * 20000)).toFixed(2)).join('|'),
      taskNumbers: `000${162700 + i}`,
    });
  }
  return rows;
}

export const routesData: RouteData[] = [
  {
    id: 'route_1',
    name: 'АЗОВ',
    rows: generateRows('azov', 30),
    summary: {
      currentMonthNds: 2847560,
      prevMonthNds: 2612340,
      totalCost: 186400,
      dohod: 398200,
    },
  },
  {
    id: 'route_2',
    name: 'БАТАЙСК',
    rows: generateRows('bataisk', 25),
    summary: {
      currentMonthNds: 1923400,
      prevMonthNds: 1845600,
      totalCost: 142300,
      dohod: 287600,
    },
  },
  {
    id: 'route_3',
    name: 'РОСТОВ',
    rows: generateRows('rostov', 28),
    summary: {
      currentMonthNds: 3456780,
      prevMonthNds: 3123400,
      totalCost: 234500,
      dohod: 512300,
    },
  },
  {
    id: 'route_4',
    name: 'ТАГАНРОГ',
    rows: generateRows('taganrog', 22),
    summary: {
      currentMonthNds: 1567800,
      prevMonthNds: 1423500,
      totalCost: 123400,
      dohod: 234100,
    },
  },
  {
    id: 'route_5',
    name: 'НОВОЧЕРКАССК',
    rows: generateRows('novocherkassk', 20),
    summary: {
      currentMonthNds: 987600,
      prevMonthNds: 876500,
      totalCost: 89700,
      dohod: 156400,
    },
  },
];

export const defaultColumns: ColumnConfig[] = [
  { key: 'date', label: 'Дата', visible: true, group: 'basic' },
  { key: 'day', label: 'День', visible: true, group: 'basic' },
  { key: 'time', label: 'Время', visible: true, group: 'basic' },
  { key: 'queue', label: 'Плановая', visible: true, group: 'basic' },
  { key: 'clients', label: 'Клиенты', visible: true, group: 'basic' },
  { key: 'avg-day', label: 'Ср. день', visible: true, group: 'avg' },
  { key: 'avg-week', label: 'Ср. неделя', visible: true, group: 'avg' },
  { key: 'sum-route', label: 'Сумма маршрут', visible: true, group: 'sums' },
  { key: 'sum-day', label: 'Сумма день', visible: false, group: 'sums' },
  { key: 'sum-week', label: 'Сумма неделя', visible: false, group: 'sums' },
  { key: 'sum-nds', label: 'Без НДС', visible: true, group: 'sums' },
  { key: 'exp-client', label: 'Клиентские', visible: false, group: 'costs' },
  { key: 'exp-route', label: 'Стоимость маш.', visible: true, group: 'costs' },
  { key: 'margin', label: 'Маржа', visible: true, group: 'costs' },
  { key: 'cost', label: 'Расходы', visible: true, group: 'costs' },
  { key: 'cost-cum', label: 'Расх. накопит.', visible: false, group: 'costs' },
  { key: 'dohod', label: 'Доходность', visible: true, group: 'profit' },
  { key: 'dohod-itog', label: 'Доход. итого', visible: false, group: 'profit' },
  { key: 'dohod-cum', label: 'Доход. накопит.', visible: false, group: 'profit' },
  { key: 'km', label: 'КМ', visible: false, group: 'extra' },
  { key: 'time-calc', label: 'Время расч.', visible: false, group: 'extra' },
  { key: 'returns', label: 'Возвраты', visible: true, group: 'extra' },
  { key: 'cancelled', label: 'Отмены', visible: true, group: 'extra' },
];
