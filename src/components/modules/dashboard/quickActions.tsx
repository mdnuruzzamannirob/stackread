'use client'

import { Award, BookOpen, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

interface QuickActionData {
  title: string
  description: string
  icon: React.ReactNode
  action: string
  href: string
  bgColor: string
}

interface QuickActionsProps {
  locale: string
  actions?: QuickActionData[]
}

export function QuickActions({
  locale,
  actions = [
    {
      title: 'Start Reading',
      description: 'Pick up where you left off',
      icon: <BookOpen className="size-5" />,
      action: 'Continue',
      href: '/library/currently-reading',
      bgColor: 'bg-primary/10 text-primary',
    },
    {
      title: 'Write a Review',
      description: 'Share your thoughts on books',
      icon: <Award className="size-5" />,
      action: 'Write',
      href: '/reviews/new',
      bgColor:
        'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    },
    {
      title: 'Track Progress',
      description: 'Update your reading progress',
      icon: <TrendingUp className="size-5" />,
      action: 'Update',
      href: '/reading/track',
      bgColor: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Get Recommendations',
      description: 'Discover books for you',
      icon: <Zap className="size-5" />,
      action: 'Explore',
      href: '/recommendations',
      bgColor: 'bg-accent/10 text-accent',
    },
  ],
}: QuickActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={`/${locale}${action.href}`}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:shadow-soft-md hover:border-primary/30"
        >
          <div
            className={`mb-3 inline-block rounded-lg p-2.5 ${action.bgColor} transition-all duration-300 group-hover:scale-110`}
          >
            {action.icon}
          </div>

          <h3 className="font-semibold text-foreground">{action.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {action.description}
          </p>

          <div className="mt-3 flex items-center text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
            {action.action}
            <svg
              className="ml-1 size-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}
