import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you requested does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
