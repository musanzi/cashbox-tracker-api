export interface ChartData {
  name: string;
  value: number;
}

export interface DashboardSummary {
  totalBalance: number;
  totalTransactions: number;
  totalTransfers: number;
  totalUsers: number;
}

export interface DashboardData {
  chartData: ChartData[];
  summary: ChartData[];
}
