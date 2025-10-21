export default function CustomersAndFeedbackSection() {
  return (
    <section id="customers" className="space-y-4">
      <h2 className="text-2xl font-bold text-white drop-shadow-md">Customers & Feedback</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-4">
          <div className="text-sm font-medium mb-2">Customers</div>
          <div className="space-y-2">
            {[1,2,3].map(i=> (
              <div key={i} className="rounded-lg border-2 border-white/20 bg-white px-3 py-2 flex items-center justify-between text-sm shadow">
                <span>Customer Name</span>
                <span className="text-gray-600">Last order —</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-4">
          <div className="text-sm font-medium mb-2">Feedback</div>
          <div className="space-y-2">
            {[1,2,3].map(i=> (
              <div key={i} className="rounded-lg border-2 border-white/20 bg-white px-3 py-2 text-sm shadow">
                <div className="flex items-center justify-between">
                  <span>Order #10{i}</span>
                  <span className="text-gray-600">★★★★☆</span>
                </div>
                <div className="mt-1 text-gray-600">Short comment preview…</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}