'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We could not complete this request.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
