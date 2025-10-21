"use client";

export default function SettingsSection() {
  return (
    <section id="settings" className="space-y-4">
      <h2 className="text-2xl font-bold text-white drop-shadow-md">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Business Info','Hours','Payments','Notifications','Security','Integrations'].map((s)=> (
          <div key={s} className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-4">
            <div className="h-10 w-10 rounded-xl bg-white border-2 border-white/20 mb-3 shadow" />
            <div className="font-medium">{s}</div>
            <div className="mt-1 text-sm text-gray-600">Short description</div>
          </div>
        ))}
      </div>
    </section>
  );
}