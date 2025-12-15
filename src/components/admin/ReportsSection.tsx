"use client";

import { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, Download, Filter, Clock } from 'lucide-react';

export default function ReportsSection() {
  const [dateRange, setDateRange] = useState('last7days');
  const [reportType, setReportType] = useState('overview');

  // Sample data for charts
  const salesData = [
    { day: 'Mon', sales: 1250, orders: 45 },
    { day: 'Tue', sales: 1580, orders: 52 },
    { day: 'Wed', sales: 1920, orders: 63 },
    { day: 'Thu', sales: 1650, orders: 55 },
    { day: 'Fri', sales: 2340, orders: 78 },
    { day: 'Sat', sales: 3150, orders: 95 },
    { day: 'Sun', sales: 2890, orders: 89 }
  ];

  const topItems = [
    { name: 'Classic Burger', orders: 156, revenue: 2025.44 },
    { name: 'Margherita Pizza', orders: 142, revenue: 2128.58 },
    { name: 'Grilled Salmon', orders: 98, revenue: 1860.02 },
    { name: 'Caesar Salad', orders: 87, revenue: 739.50 },
    { name: 'French Fries', orders: 203, revenue: 913.50 }
  ];

  const categoryBreakdown = [
    { category: 'Main Course', percentage: 45, revenue: 6840.50 },
    { category: 'Appetizers', percentage: 20, revenue: 3040.00 },
    { category: 'Desserts', percentage: 15, revenue: 2280.00 },
    { category: 'Beverages', percentage: 12, revenue: 1824.00 },
    { category: 'Sides', percentage: 8, revenue: 1216.00 }
  ];

  const peakHoursData = [
    { hour: '10 AM', count: 12 },
    { hour: '11 AM', count: 25 },
    { hour: '12 PM', count: 45 },
    { hour: '1 PM', count: 38 },
    { hour: '2 PM', count: 20 },
    { hour: '3 PM', count: 15 },
    { hour: '4 PM', count: 18 },
    { hour: '5 PM', count: 30 },
    { hour: '6 PM', count: 55 },
    { hour: '7 PM', count: 62 },
    { hour: '8 PM', count: 48 },
    { hour: '9 PM', count: 25 },
  ];
  
  const maxPeak = Math.max(...peakHoursData.map(d => d.count));

  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalSales / totalOrders;

  const maxSales = Math.max(...salesData.map(d => d.sales));

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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">${totalSales.toFixed(2)}</div>
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
              <div className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</div>
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

        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">New Customers</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">47</div>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-orange-600">
                <TrendingUp className="w-4 h-4" />
                <span>+18.2% vs last period</span>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3 text-white shadow-lg">
              <Users className="w-6 h-6" />
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Rank</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Item Name</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Orders</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-100 text-gray-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-4 px-4 text-right font-semibold">{item.orders}</td>
                  <td className="py-4 px-4 text-right font-bold text-green-600">${item.revenue.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">
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
          {peakHoursData.map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex items-end justify-center h-full">
                <div 
                  className="w-full bg-orange-100 rounded-t-lg group-hover:bg-orange-200 transition-colors relative"
                  style={{ height: `${(data.count / maxPeak) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {data.count} reservations
                  </div>
                </div>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ height: `${(data.count / maxPeak) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 -rotate-45 sm:rotate-0 origin-top sm:origin-center mt-2 sm:mt-0 whitespace-nowrap">
                {data.hour}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}