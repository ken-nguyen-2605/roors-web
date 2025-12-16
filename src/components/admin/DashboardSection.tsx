"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Users, Calendar, DollarSign } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

// function MetricCard({ label, value, change, icon, trend }: MetricCardProps) {
//   return (
//     <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">{label}</div>
//           <div className="mt-3 text-3xl font-bold text-gray-900">{value}</div>
//           {change !== undefined && (
//             <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${
//               trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
//             }`}>
//               {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
//               <span>{Math.abs(change)}% vs yesterday</span>
//             </div>
//           )}
//         </div>
//         <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3 text-white shadow-lg">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function DashboardSection() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    todaySales: 2847.50,
    activeOrders: 12,
    upcomingReservations: 8,
    avgPrepTime: 18
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        todaySales: prev.todaySales + Math.random() * 50,
        activeOrders: Math.max(0, prev.activeOrders + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Dashboard</h2>
          <p className="text-white/80 mt-1">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-white drop-shadow-lg">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-white/80 text-sm">Real-time updates</div>
        </div>
      </div>  

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Today's Sales"
          value={`$${metrics.todaySales.toFixed(2)}`}
          change={12.5}
          trend="up"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <MetricCard
          label="Active Orders"
          value={metrics.activeOrders}
          change={5.2}
          trend="up"
          icon={<Clock className="w-6 h-6" />}
        />
        <MetricCard
          label="Upcoming Reservations"
          value={metrics.upcomingReservations}
          change={-3.1}
          trend="down"
          icon={<Calendar className="w-6 h-6" />}
        />
        <MetricCard
          label="Avg Prep Time"
          value={`${metrics.avgPrepTime} min`}
          change={8.7}
          trend="down"
          icon={<Users className="w-6 h-6" />}
        />
      </div> */}

      {/* Recent Activity */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Recent Orders
          </h3>
          <div className="space-y-3">
            {[
              { id: '#1045', customer: 'John Doe', amount: '$45.50', time: '2 min ago', status: 'Preparing' },
              { id: '#1044', customer: 'Sarah Smith', amount: '$32.00', time: '5 min ago', status: 'Ready' },
              { id: '#1043', customer: 'Mike Johnson', amount: '$67.80', time: '12 min ago', status: 'Delivered' }
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.id} • {order.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{order.amount}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Today's Reservations
          </h3>
          <div className="space-y-3">
            {[
              { time: '12:30 PM', name: 'Anderson Family', party: 4, table: 'T-12' },
              { time: '1:00 PM', name: 'Business Meeting', party: 6, table: 'T-8' },
              { time: '2:30 PM', name: 'Wilson Party', party: 2, table: 'T-5' }
            ].map((reservation, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    {reservation.party}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{reservation.name}</div>
                    <div className="text-xs text-gray-500">{reservation.time} • Table {reservation.table}</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
}