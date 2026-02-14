export interface ChartDataPoint {
  date: string;
  primary: number;
  secondary?: number;
}

export interface DashboardStats {
  total_students: number;
  active_students: number;
  pending_students: number;
  total_earning: number;
  this_month_earning: number;
}

export interface DashboardCharts {
  earnings_overview: {
    labels: string[];
    data: number[];
  };
  student_enrollments: {
    labels: string[];
    data: number[];
  };
  student_status: {
    active: number;
    pending: number;
  };
}

export interface DashboardInsights {
  avg_earning_per_student: number;
  this_week_enrollments: number;
  conversion_rate: number;
  best_month: string;
}

export interface DashboardActivity {
  name: string;
  action: string;
  time: string;
  amount: string;
  status: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  charts: DashboardCharts;
  quick_insights: DashboardInsights;
  recent_activity: DashboardActivity[];
}
