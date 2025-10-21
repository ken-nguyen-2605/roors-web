"use client";

export default function MenuSection() {
  return (
    <section id="menu" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">Menu</h2>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 rounded-lg bg-white/90 shadow-sm border border-white/20" />
          <div className="h-9 w-28 rounded-lg bg-gray-900 text-white grid place-content-center text-xs font-medium shadow-lg">
            Add Item
          </div>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl overflow-hidden">
  <div className="grid grid-cols-12 text-xs font-semibold bg-gray-100/90 px-4 py-3 rounded-t-2xl">
          <div className="col-span-5">Item</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
  <div className="divide-y divide-gray-200/60 first:rounded-t-2xl last:rounded-b-2xl">
          {[1,2,3].map((r)=> (
            <div key={r} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
            <div className="col-span-5">Dish Name</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2">$—</div>
            <div className="col-span-2 text-right">
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs">Available</span>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}