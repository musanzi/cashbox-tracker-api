export interface ChartData {
  name: string;
  value: number;
}

export interface DashboardData {
  chartData: ChartData[];
}
