"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  Filter,
  Clock,
} from 'lucide-react';
import adminStatisticsService from '@/services/adminStatisticsService';
import reservationService from '@/services/reservationService';

// Match backend DTOs from com.josephken.roors.admin.dto
type OrderStatsByDateDto = {
  date: string; // LocalDate serialized as ISO string
  orderCount: number;
  revenue: number;
};

type TopSellingItemDto = {
  menuItemId: number;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
};

type DashboardStatsDto = {
  totalOrders: number;
  totalRevenue: number;
  totalMenuItems: number;
  totalUsers: number;
  revenueOverTime: OrderStatsByDateDto[];
  topSellingItems: TopSellingItemDto[];
  orderStatusDistribution: Record<string, number>;
  categorySales: {
    categoryName: string;
    orderCount: number;
    revenue: number;
  }[];
};

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ReportsSection() {
  const [dateRange, setDateRange] = useState('last7days');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [salesData, setSalesData] = useState<
    { day: string; sales: number; orders: number }[]
  >([]);

  const [topItems, setTopItems] = useState<
    { name: string; orders: number; revenue: number }[]
  >([]);

  const [categoryBreakdown, setCategoryBreakdown] = useState<
    { category: string; percentage: number; revenue: number }[]
  >([]);

  // Reservations-by-weekday data (real reservations, not orders)
  const [reservationsByWeekday, setReservationsByWeekday] = useState<
    { day: string; reservations: number }[]
  >(() => weekdayLabels.map((d) => ({ day: d, reservations: 0 })));
  const [maxWeekdayReservations, setMaxWeekdayReservations] = useState(0);

  // Map your UI dateRange keys to backend "days" parameter.
  const daysForRange = useMemo(() => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return 1;
      case 'last7days':
        return 7;
      case 'last30days':
        return 30;
      case 'thismonth': {
        // Calculate days from start of current month to today
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const diffTime = now.getTime() - startOfMonth.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1; // At least 1 day
      }
      case 'lastmonth': {
        // Calculate days from today back to the start of last month
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const daysFromTodayToLastMonthStart = Math.ceil((now.getTime() - firstDayLastMonth.getTime()) / (1000 * 60 * 60 * 24));
        return daysFromTodayToLastMonthStart;
      }
      default:
        return 30;
    }
  }, [dateRange]);

  useEffect(() => {
    if (reportType !== 'overview') return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      const result = await adminStatisticsService.getDashboardStatistics(
        daysForRange,
      );

      if (!result.success) {
        setError(result.message || 'Failed to load statistics');
        setLoading(false);
        return;
      }

      const stats = result.data as DashboardStatsDto;

      // revenueOverTime: List<OrderStatsByDate> from backend (already filtered by date range)
      let revenueOverTime = stats.revenueOverTime || [];
      
      // For "thismonth", filter to only include current month's data
      if (dateRange === 'thismonth') {
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        revenueOverTime = revenueOverTime.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= firstDayThisMonth && entryDate <= lastDayThisMonth;
        });
      }
      
      // For "lastmonth", filter to only include last month's data (exclude current month)
      if (dateRange === 'lastmonth') {
        const now = new Date();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        
        revenueOverTime = revenueOverTime.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= firstDayLastMonth && entryDate <= lastDayLastMonth;
        });
      }
      
      // Calculate metrics from the filtered revenueOverTime data to ensure they match the selected date range
      const calculatedRevenue = revenueOverTime.reduce(
        (sum, entry) => sum + Number(entry.revenue ?? 0),
        0
      );
      const calculatedOrders = revenueOverTime.reduce(
        (sum, entry) => sum + Number(entry.orderCount ?? 0),
        0
      );

      // Use calculated values instead of backend aggregates (which aren't filtered)
      setTotalRevenue(calculatedRevenue);
      setOrdersCount(calculatedOrders);

      const transformedSales = revenueOverTime.map((entry) => ({
        day: entry.date,
        sales: Number(entry.revenue ?? 0),
        orders: Number(entry.orderCount ?? 0),
      }));

      setSalesData(transformedSales);

      // topSellingItems: List<TopSellingItem>
      const topSellingItems = stats.topSellingItems || [];
      setTopItems(
        topSellingItems.map((item) => ({
          name: item.name,
          orders: Number(item.totalQuantity ?? 0),
          revenue: Number(item.totalRevenue ?? 0),
        })),
      );

      // Category sales from backend (real category + revenue).
      // If backend doesn't send it yet or it's empty, fall back to status distribution
      const categorySales = stats.categorySales || [];

      if (categorySales.length > 0) {
        const totalCategoryRevenue = categorySales.reduce(
          (sum, c) => sum + Number(c.revenue ?? 0),
          0,
        );

        const categoryData = categorySales.map((c) => {
          const revenue = Number(c.revenue ?? 0);
          const percentage =
            totalCategoryRevenue === 0
              ? 0
              : Math.round((revenue / totalCategoryRevenue) * 100);

          return {
            category: c.categoryName,
            percentage,
            revenue,
          };
        });

        setCategoryBreakdown(categoryData);
      } else {
        // Fallback: derive categories from orderStatusDistribution (older BE or no data)
        const statusDistribution = stats.orderStatusDistribution || {};
        const totalStatusCount = Object.values(statusDistribution).reduce(
          (sum: number, v) => sum + Number(v),
          0,
        );

        const categoryData = Object.entries(statusDistribution).map(
          ([status, count]) => {
            const percentage =
              totalStatusCount === 0
                ? 0
                : Math.round((Number(count) / totalStatusCount) * 100);

            const revenueShare = (totalRevenue * percentage) / 100;

            return {
              category: status,
              percentage,
              revenue: revenueShare,
            };
          },
        );

        setCategoryBreakdown(categoryData);
      }

      setLoading(false);
    };

    fetchStats();
  }, [daysForRange, reportType]);

  // Fetch and aggregate reservations for "Reservations by Day of Week" chart
  useEffect(() => {
    if (reportType !== 'overview') return;

    const fetchReservationsStats = async () => {
      try {
        const result = await reservationService.getAllReservations();
        if (!result.success || !Array.isArray(result.data)) {
          // If API responds in a different envelope, try `result.data.content` or bail gracefully
          const rawList = Array.isArray(result.data)
            ? result.data
            : [];

          if (!rawList.length) {
            setReservationsByWeekday(
              weekdayLabels.map((d) => ({ day: d, reservations: 0 })),
            );
            setMaxWeekdayReservations(0);
            return;
          }
        }

        const reservationsArray: any[] = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data)
          ? result.data
          : [];

        // Prepare buckets Sun–Sat
        const weekdayTotals = new Array(7).fill(0);

        const now = new Date();
        const startCutoff = new Date();
        startCutoff.setDate(now.getDate() - (daysForRange - 1));

        reservationsArray.forEach((item) => {
          const startTime = item.startTime || item.reservationDate;
          if (!startTime) return;

          const date = new Date(startTime);
          if (Number.isNaN(date.getTime())) return;

          // Filter by selected date range (last N days)
          if (date < startCutoff || date > now) return;

          // Optionally ignore cancelled / no-show
          const status = item.status;
          if (status === 'CANCELLED' || status === 'NO_SHOW') return;

          const weekdayIndex = date.getDay(); // 0 (Sun) - 6 (Sat)
          weekdayTotals[weekdayIndex] += 1;
        });

        const aggregated = weekdayLabels.map((label, idx) => ({
          day: label,
          reservations: weekdayTotals[idx],
        }));

        const maxReservations = Math.max(...weekdayTotals, 0);

        setReservationsByWeekday(aggregated);
        setMaxWeekdayReservations(maxReservations);
      } catch (e) {
        console.error('Failed to load reservations stats for dashboard', e);
        setReservationsByWeekday(
          weekdayLabels.map((d) => ({ day: d, reservations: 0 })),
        );
        setMaxWeekdayReservations(0);
      }
    };

    fetchReservationsStats();
  }, [daysForRange, reportType]);

  const avgOrderValue =
    ordersCount > 0 ? totalRevenue / ordersCount : 0;

  const maxSales = salesData.length
    ? Math.max(...salesData.map((d) => d.sales))
    : 0;

  const handleExport = () => {
    try {
      const lines: string[] = [];

      // Meta info
      lines.push(`Report range,${dateRange},Last ${daysForRange} days`);
      lines.push('');

      // Sales trend section
      lines.push('Sales Trend');
      lines.push('Date,Revenue,Orders');
      salesData.forEach((d) => {
        lines.push(`${d.day},${d.sales},${d.orders}`);
      });
      lines.push('');

      // Top selling items section
      lines.push('Top Selling Items');
      lines.push('Rank,Item Name,Orders,Revenue');
      topItems.forEach((item, idx) => {
        const safeName = `"${item.name.replace(/"/g, '""')}"`;
        lines.push(
          `${idx + 1},${safeName},${item.orders},${item.revenue.toFixed(2)}`,
        );
      });
      lines.push('');

      // Category breakdown section
      lines.push('Sales by Category');
      lines.push('Category,Percentage,Revenue');
      categoryBreakdown.forEach((cat) => {
        const safeCategory = `"${cat.category.replace(/"/g, '""')}"`;
        lines.push(
          `${safeCategory},${cat.percentage},${cat.revenue.toFixed(2)}`,
        );
      });
      lines.push('');

      // Reservations by weekday section
      lines.push('Reservations by Day of Week');
      lines.push('Day,Reservations');
      reservationsByWeekday.forEach((d) => {
        lines.push(`${d.day},${d.reservations}`);
      });

      const csvContent = lines.join('\r\n');
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, '-');
      link.href = url;
      link.setAttribute(
        'download',
        `reports-${dateRange}-${timestamp}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export reports CSV', e);
    }
  };

  return (
    <section id="reports" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Reports & Analytics</h2>
          <p className="text-white/80 mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-white/20 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thismonth">This Month</option>
            <option value="lastmonth">Last Month</option>
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={
              loading ||
              (!salesData.length &&
                !topItems.length &&
                !categoryBreakdown.length &&
                !reservationsByWeekday.length)
            }
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border-2 border-white/20 bg-white/80 shadow-xl p-4 text-sm text-gray-700">
          Loading latest statistics...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 shadow-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{totalRevenue.toFixed(2)} VND</div>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% vs last period</span>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-3 text-white shadow-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{ordersCount}</div>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-blue-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8.3% vs last period</span>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3 text-white shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Avg Order Value</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{avgOrderValue.toFixed(2)} VND</div>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-purple-600">
                <TrendingUp className="w-4 h-4" />
                <span>+5.7% vs last period</span>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white shadow-lg">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Sales Trend</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-lg bg-orange-100 text-orange-600 text-sm font-medium">Revenue</button>
              <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium">Orders</button>
            </div>
          </div>

          {/* Simple Bar Chart - Scrollable with 6 items visible */}
          <div 
            className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}
          >
            {salesData.map((day, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-end pr-3 transition-all"
                        style={{ width: `${(day.sales / maxSales) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">{day.sales} VND</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600 w-16">{day.orders} orders</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <h3 className="text-lg font-bold mb-6">Sales by Category</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  <span className="text-sm font-bold text-gray-900">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">${cat.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
        <h3 className="text-lg font-bold mb-6">Top Selling Items</h3>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Rank</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Item Name</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Orders</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        idx === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : idx === 1
                          ? 'bg-gray-100 text-gray-700'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 truncate">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {item.orders}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-green-600 whitespace-nowrap">
                    {item.revenue.toFixed(2)} VND
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      {Math.floor(Math.random() * 20 + 5)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservations by Day of Week */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Reservations by Day of Week
            </h3>
            <p className="text-sm text-gray-500">
              Total reservations grouped by weekday for the selected period
            </p>
          </div>
        </div>

        {maxWeekdayReservations === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-gray-500">
            No reservations in the selected period yet.
          </div>
        ) : (
          <div className="h-64 flex items-end gap-3 sm:gap-4 overflow-x-auto pb-4">
            {reservationsByWeekday.map((d) => {
              // Use the actual max reservations as the reference for bar height (100%)
              const maxReference = maxWeekdayReservations > 0 ? maxWeekdayReservations : 1;
              const ratio =
                d.reservations <= 0
                  ? 0
                  : d.reservations / maxReference;

              // Scale heights between 20% and 95% for better visibility
              // Using absolute pixel values from the 256px container (h-64 = 256px)
              const containerHeight = 256; // h-64 = 16rem = 256px
              const minHeightPx = containerHeight * 0.2; // 20% minimum
              const maxHeightPx = containerHeight * 0.95; // 95% maximum
              const barHeightPx = d.reservations > 0 
                ? minHeightPx + (maxHeightPx - minHeightPx) * ratio 
                : 0;

              return (
                <div
                  key={d.day}
                  className="flex-1 min-w-[40px] flex flex-col items-center gap-2 group"
                >
                  <div className="relative w-full flex items-end justify-center" style={{ height: '256px' }}>
                    <div
                      className="w-full rounded-t-lg relative border border-orange-100 bg-gradient-to-t from-orange-500 to-red-500 opacity-90 group-hover:opacity-100 transition-all shadow-md"
                      style={{ height: `${barHeightPx}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-md">
                        {d.reservations} reservations
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 -rotate-45 sm:rotate-0 origin-top sm:origin-center mt-2 sm:mt-0 whitespace-nowrap">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}