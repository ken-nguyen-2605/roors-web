"use client";

export default function DashboardSection() {
  return (
    <section id="dashboard" className="space-y-4">
      <h2 className="text-2xl font-bold text-white drop-shadow-md">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: '$—' },
          { label: 'Active Orders', value: '—' },
          { label: 'Upcoming Reservations', value: '—' },
          { label: 'Avg Prep Time', value: '—' },
        ].map((k, i) => (
          <div key={i} className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="text-xs text-gray-600 font-medium">{k.label}</div>
            <div className="mt-2 text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}