export default function ProtectedLoading() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-5xl animate-pulse space-y-4">
        <div className="h-14 rounded-xl border border-border bg-card" />
        <div className="h-48 rounded-xl border border-border bg-card" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-28 rounded-xl border border-border bg-card" />
          <div className="h-28 rounded-xl border border-border bg-card" />
        </div>
      </div>
    </div>
  )
}
