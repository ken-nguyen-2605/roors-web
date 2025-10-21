"use client";

export default function ReservationsSection() {
  return (
    <section id="reservations" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">Reservations</h2>
        <div className="h-9 w-32 rounded-lg bg-white/90 shadow-sm border border-white/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-4 md:col-span-2">
          <div className="h-56 rounded-xl border-2 border-white/20 border-dashed grid place-content-center text-sm text-gray-600">
            Calendar (general view)
          </div>
        </div>
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-4">
          <div className="text-sm font-medium mb-2">Upcoming</div>
          <div className="space-y-2 text-sm">
            {[1,2,3].map(i=> (
              <div key={i} className="rounded-lg border-2 border-white/20 bg-white px-3 py-2 flex items-center justify-between shadow">
                <span>12:3{i} • Party —</span>
                <span className="text-gray-600">Table —</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}