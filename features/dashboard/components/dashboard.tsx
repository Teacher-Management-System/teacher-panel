import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Users,
  CreditCard,
  UserCheck,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  IndianRupee,
  Calendar,
  Sparkles,
  CalendarIcon,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dashboardService from "../api.service";
import { DashboardResponse } from "../model";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (date?.from) {
          params.start_date = format(date.from, "yyyy-MM-dd");
        }
        if (date?.to) {
          params.end_date = format(date.to, "yyyy-MM-dd");
        }
        const response = (await dashboardService.getDashboardData(
          params,
        )) as DashboardResponse;
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [date]);

  // Transform chart data
  const earningsData =
    data?.charts.earnings_overview.labels.map((label, index) => ({
      month: label,
      earnings: data.charts.earnings_overview.data[index],
    })) || [];

  const enrollmentData =
    data?.charts.student_enrollments.labels.map((label, index) => ({
      month: label,
      students: data.charts.student_enrollments.data[index],
    })) || [];

  const statusData = [
    {
      name: "Active",
      value: data?.charts.student_status.active || 0,
      color: "hsl(var(--success))",
    },
    {
      name: "Pending",
      value: data?.charts.student_status.pending || 0,
      color: "hsl(var(--warning))",
    },
  ];

  const stats = [
    {
      title: "Total Students",
      value: data?.stats.total_students || 0,
      change: "+12", // You might want to calculate this if historical data is available
      changeLabel: "this month",
      trend: "up",
      icon: Users,
      color: "bg-[#26c6da]",
    },
    {
      title: "Active Students",
      value: data?.stats.active_students || 0,
      change: data?.stats.total_students
        ? `${Math.round(
            ((data.stats.active_students || 0) / data.stats.total_students) *
              100,
          )}%`
        : "0%",
      changeLabel: "active rate",
      trend: "up",
      icon: UserCheck,
      color: "bg-[#66bb6a]",
    },
    {
      title: "Total Earning",
      value: `₹${(data?.stats.total_earning || 0).toLocaleString()}`,
      change: `+₹${(data?.stats.this_month_earning || 0).toLocaleString()}`,
      changeLabel: "this month",
      trend: "up",
      icon: CreditCard,
      color: "bg-[#42a5f5]",
    },
    {
      title: "Pending Students",
      value: data?.stats.pending_students || 0,
      change: data?.stats.total_students
        ? `${Math.round(
            ((data.stats.pending_students || 0) / data.stats.total_students) *
              100,
          )}%`
        : "0%",
      changeLabel: "of total",
      trend: "down",
      icon: Clock,
      color: "bg-[#ffa726]",
    },
  ];

  const quickInsights = [
    {
      label: "Avg. Earning/Student",
      value: `₹${data?.quick_insights.avg_earning_per_student || 0}`,
      icon: IndianRupee,
      color: "text-primary",
    },
    {
      label: "This Week Enrollments",
      value: data?.quick_insights.this_week_enrollments || 0,
      icon: UserPlus,
      color: "text-success",
    },
    {
      label: "Conversion Rate",
      value: `${data?.quick_insights.conversion_rate || 0}%`,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "Best Month",
      value: data?.quick_insights.best_month || "-",
      icon: Calendar,
      color: "text-warning",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] rounded-xl" />
          <Skeleton className="h-[350px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <Badge className="bg-primary/10 text-primary border-0 gap-1">
              <Sparkles className="w-3 h-3" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Here's your performance overview.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 px-3 text-muted-foreground border-r">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"ghost"}
                className={cn(
                  "justify-start text-left font-normal hover:bg-transparent",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg overflow-hidden card-hover animate-fade-in group p-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-0">
              <div
                className={`${stat.color} flex-1 p-6 text-white relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Decorative circles - subtler now */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-white/90 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="font-display text-4xl font-bold tracking-tight mb-1">
                    {stat.value}
                  </p>
                  <p className="text-white/80 text-xs font-medium">
                    {stat.changeLabel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Earnings Chart */}
        <Card
          className="border-0 shadow-lg animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                Earnings Overview
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-success/10 text-success border-0"
              >
                +18% vs last month
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={earningsData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="earningsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      "Earnings",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enrollments Chart */}
        <Card
          className="border-0 shadow-lg animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#009688]/10 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-[#009688]" />
                </div>
                Student Enrollments
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-[#009688]/10 text-[#009688] border-0"
              >
                {data?.quick_insights.this_week_enrollments} this week
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={enrollmentData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [value, "Students"]}
                  />
                  <Bar
                    dataKey="students"
                    fill="#009688"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Status Pie Chart */}
        <Card
          className="border-0 shadow-lg animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-success" />
              </div>
              Student Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-2xl font-bold">
                    {data?.stats.total_students || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card
          className="border-0 shadow-lg animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-warning" />
              </div>
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickInsights.map((insight, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${insight.color}`}
                  >
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {insight.label}
                  </span>
                </div>
                <span className="font-display font-bold text-foreground">
                  {insight.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card
          className="border-0 shadow-lg animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.recent_activity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status === "success"
                      ? "bg-success/10 text-success"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.action} • {activity.time}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-success/10 text-success border-0 text-xs flex-shrink-0"
                >
                  ₹{activity.amount}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
