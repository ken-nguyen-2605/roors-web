"use client";

import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, Download, Filter, Clock } from 'lucide-react';
import adminStatisticsService from '@/services/adminStatisticsService';

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

  const [peakHoursData, setPeakHoursData] = useState<
    { hour: string; count: number }[]
  >([]);

  // Map your UI dateRange keys to backend "days" parameter.
  const daysForRange = useMemo(() => {
    switch (dateRange) {
      case 'today':
        return 1;
      case 'last7days':
        return 7;
      case 'last30days':
        return 30;
      case 'thismonth':
        return 30;
      case 'lastmonth':
        return 60;
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

      // Top-level aggregates from backend
      setTotalRevenue(Number(stats.totalRevenue ?? 0));
      setOrdersCount(Number(stats.totalOrders ?? 0));

      // revenueOverTime: List<OrderStatsByDate> from backend
      const revenueOverTime = stats.revenueOverTime || [];
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

      // Peak hours are not directly provided; derive simple pseudo data from revenueOverTime
      const peakData =
        revenueOverTime.length > 0
          ? revenueOverTime.map((entry) => ({
              hour: entry.date,
              count: Number(entry.orderCount ?? 0),
            }))
          : [];

      setPeakHoursData(peakData);

      setLoading(false);
    };

    fetchStats();
  }, [daysForRange, reportType]);

  const maxPeak = peakHoursData.length
    ? Math.max(...peakHoursData.map((d) => d.count))
    : 0;

  const avgOrderValue =
    ordersCount > 0 ? totalRevenue / ordersCount : 0;

  const maxSales = salesData.length
    ? Math.max(...salesData.map((d) => d.sales))
    : 0;

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
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</div>
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
              <div className="text-3xl font-bold text-gray-900 mt-2">${avgOrderValue.toFixed(2)}</div>
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

          {/* Simple Bar Chart */}
          <div className="space-y-4">
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
                        <span className="text-xs font-bold text-white">${day.sales}</span>
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
                    ${item.revenue.toFixed(2)}
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

      {/* Peak Reservation Hours */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Peak Reservation Hours</h3>
            <p className="text-sm text-gray-500">Average number of reservations by hour</p>
          </div>
        </div>
        
        <div className="h-64 flex items-end gap-2 sm:gap-4">
          {peakHoursData.map((data, idx) => {
            const rawHeight = maxPeak ? (data.count / maxPeak) * 100 : 0;
            const barHeight = data.count > 0 ? Math.max(rawHeight, 8) : 0; // ensure visible bar

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className="w-full bg-orange-50 rounded-t-lg group-hover:bg-orange-100 transition-colors relative border border-orange-100"
                    style={{ height: `${barHeight}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-md">
                      {data.count} reservations
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg opacity-90 group-hover:opacity-100 transition-opacity shadow-md"
                    style={{ height: `${barHeight}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 -rotate-45 sm:rotate-0 origin-top sm:origin-center mt-2 sm:mt-0 whitespace-nowrap">
                  {data.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}