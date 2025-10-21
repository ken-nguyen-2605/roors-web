"use client";

export default function OrdersSection() {
  return (
    <section id="orders" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">Orders</h2>
        <div className="h-9 w-40 rounded-xl bg-white/90 shadow-sm border border-white/20" />
      </div>
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl overflow-hidden">
  <div className="grid grid-cols-12 text-xs font-semibold bg-gray-100/90 px-4 py-3 rounded-t-2xl">
          <div className="col-span-2">Order #</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
  <div className="divide-y divide-gray-200/60 first:rounded-t-2xl last:rounded-b-2xl">
          {[1,2,3].map((r)=> (
            <div key={r} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
            <div className="col-span-2">#10{r}</div>
            <div className="col-span-3">Customer Name</div>
            <div className="col-span-2">$—</div>
            <div className="col-span-3">
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs">Preparing</span>
            </div>
            <div className="col-span-2 text-right">
              <div className="inline-block h-8 w-24 rounded-lg bg-gray-100 border" />
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}