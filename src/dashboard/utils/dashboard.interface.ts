export interface MonthlyTotal {
  total: string;
  month: string;
}

export interface DashboardData {
  totalUsers: number;
  totalCashboxes: number;
  totalTransfersByMonth: MonthlyTotal[];
  totalTransactionsByMonth: MonthlyTotal[];
  availableBalance: { availableBalance: string };
}
