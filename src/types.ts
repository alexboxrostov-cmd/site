export interface RouteRow {
  id: string;
  date: string;
  day: string;
  time: string;
  queue: string;
  clientsCount: number;
  avgDay: number;
  avgWeek: number;
  sumRoute: number;
  sumDay: number;
  sumWeek: number;
  sumNds: number;
  expClient: number;
  expRoute: number;
  margin: number;
  cost: number;
  costCum: number;
  dohod: number;
  dohodItog: number;
  dohodCum: number;
  km: number | null;
  timeCalc: string | null;
  returns: number;
  cancelled: number;
  clients: string;
  clientSums: string;
  taskNumbers: string;
}

export interface RouteData {
  id: string;
  name: string;
  rows: RouteRow[];
  summary: {
    currentMonthNds: number;
    prevMonthNds: number;
    totalCost: number;
    dohod: number;
  };
}

export interface ConnectedRoute {
  id: string;
  name: string;
  routeIds: string[];
  createdAt: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  group: string;
}
