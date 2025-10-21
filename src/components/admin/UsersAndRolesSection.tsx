export default function UsersAndRolesSection() {
  return (
    <section id="users" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">Users & Roles</h2>
        <div className="h-9 w-28 rounded-lg bg-gray-100 border" />
      </div>
      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="grid grid-cols-12 text-xs text-gray-500 px-4 py-2">
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
  <div className="divide-y divide-gray-200/60">
          {[1,2,3].map((r)=> (
            <div key={r} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
            <div className="col-span-5">Staff Name</div>
            <div className="col-span-3">Role Template</div>
            <div className="col-span-2">Active</div>
            <div className="col-span-2 text-right"><div className="inline-block h-8 w-24 rounded-lg bg-gray-100 border" /></div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}