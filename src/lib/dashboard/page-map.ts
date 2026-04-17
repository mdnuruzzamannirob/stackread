import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BookMarked,
  BookOpen,
  Compass,
  CreditCard,
  Heart,
  History,
  LayoutDashboard,
  Search,
  Settings2,
  Shield,
  SlidersHorizontal,
  TriangleAlert,
  UserRound,
} from 'lucide-react'

export type DashboardPageAvailability = 'ready' | 'planned'

export type DashboardPageNode = {
  id: string
  labelKey: string
  descriptionKey?: string
  path?: string
  icon: LucideIcon
  availability: DashboardPageAvailability
  backendRoutes: string[]
  children?: DashboardPageNode[]
}

export type DashboardPageSection = {
  id: string
  labelKey: string
  items: DashboardPageNode[]
}

export const dashboardPageSections: DashboardPageSection[] = [
  {
    id: 'discover',
    labelKey: 'dashboard.sidebar.sections.discover',
    items: [
      {
        id: 'dashboard-home',
        labelKey: 'dashboard.sidebar.items.dashboard',
        descriptionKey: 'dashboard.sidebar.descriptions.dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        availability: 'ready',
        backendRoutes: [
          'GET /dashboard',
          'GET /dashboard/stats',
          'GET /dashboard/recommendations',
        ],
      },
      {
        id: 'search',
        labelKey: 'dashboard.sidebar.items.search',
        descriptionKey: 'dashboard.sidebar.descriptions.search',
        path: '/search',
        icon: Search,
        availability: 'ready',
        backendRoutes: [
          'GET /search',
          'GET /search/suggestions',
          'GET /search/popular-terms',
          'GET /search/history',
          'POST /search/log-click',
        ],
      },
      {
        id: 'library',
        labelKey: 'dashboard.sidebar.items.library',
        descriptionKey: 'dashboard.sidebar.descriptions.library',
        path: '/library',
        icon: BookOpen,
        availability: 'ready',
        backendRoutes: [
          'GET /dashboard/library',
          'GET /reading/currently-reading',
          'GET /reading/history',
          'GET /reading/completed',
        ],
        children: [
          {
            id: 'currently-reading',
            labelKey: 'dashboard.sidebar.items.currentlyReading',
            path: '/reading/currently-reading',
            icon: Compass,
            availability: 'ready',
            backendRoutes: ['GET /reading/currently-reading'],
          },
          {
            id: 'reading-history',
            labelKey: 'dashboard.sidebar.items.readingHistory',
            path: '/reading/history',
            icon: History,
            availability: 'ready',
            backendRoutes: ['GET /reading/history'],
          },
          {
            id: 'wishlist',
            labelKey: 'dashboard.sidebar.items.wishlist',
            path: '/wishlist',
            icon: Heart,
            availability: 'ready',
            backendRoutes: [
              'GET /wishlist',
              'POST /wishlist/:bookId',
              'DELETE /wishlist/:bookId',
            ],
          },
          {
            id: 'bookmarks',
            labelKey: 'dashboard.sidebar.items.bookmarks',
            path: '/reading/bookmarks',
            icon: BookMarked,
            availability: 'ready',
            backendRoutes: [
              'GET /books/:bookId/bookmarks',
              'POST /books/:bookId/bookmarks',
              'PATCH /books/:bookId/bookmarks/:id',
              'DELETE /books/:bookId/bookmarks/:id',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'account',
    labelKey: 'dashboard.sidebar.sections.account',
    items: [
      {
        id: 'notifications',
        labelKey: 'dashboard.sidebar.items.notifications',
        descriptionKey: 'dashboard.sidebar.descriptions.notifications',
        path: '/notifications',
        icon: Bell,
        availability: 'ready',
        backendRoutes: [
          'GET /notifications',
          'GET /notifications/unread-count',
          'PATCH /notifications/:id/read',
          'PATCH /notifications/mark-read',
        ],
      },
      {
        id: 'settings-group',
        labelKey: 'dashboard.sidebar.items.settings',
        icon: Settings2,
        availability: 'ready',
        backendRoutes: [],
        children: [
          {
            id: 'profile',
            labelKey: 'dashboard.sidebar.items.profile',
            path: '/profile',
            icon: UserRound,
            availability: 'ready',
            backendRoutes: [
              'GET /auth/me',
              'PATCH /auth/me',
              'PATCH /auth/me/profile-picture',
            ],
          },
          {
            id: 'security',
            labelKey: 'dashboard.sidebar.items.security',
            path: '/security',
            icon: Shield,
            availability: 'ready',
            backendRoutes: [
              'PATCH /auth/me/password',
              'POST /auth/2fa/enable',
              'POST /auth/2fa/verify',
              'POST /auth/2fa/disable',
              'GET /auth/me/login-history',
            ],
          },
          {
            id: 'preferences',
            labelKey: 'dashboard.sidebar.items.preferences',
            path: '/preferences',
            icon: SlidersHorizontal,
            availability: 'ready',
            backendRoutes: ['PATCH /auth/me/notification-prefs'],
          },
          {
            id: 'subscription',
            labelKey: 'dashboard.sidebar.items.subscription',
            path: '/subscription',
            icon: CreditCard,
            availability: 'ready',
            backendRoutes: [
              'GET /subscriptions/my',
              'GET /subscriptions/my/history',
              'PATCH /subscriptions/my/renew',
              'PATCH /subscriptions/my/cancel',
              'POST /subscriptions/my/retry-payment',
              'PATCH /subscriptions/my/upgrade',
              'PATCH /subscriptions/my/downgrade',
            ],
          },
          {
            id: 'danger',
            labelKey: 'dashboard.sidebar.items.danger',
            path: '/danger',
            icon: TriangleAlert,
            availability: 'ready',
            backendRoutes: ['DELETE /auth/me'],
          },
        ],
      },
    ],
  },
]

const stripLocalePrefix = (pathname: string, locale: string) => {
  const localePrefix = `/${locale}`

  if (pathname === localePrefix) {
    return '/'
  }

  if (pathname.startsWith(`${localePrefix}/`)) {
    return pathname.slice(localePrefix.length)
  }

  return pathname
}

export const withLocalePath = (locale: string, path: string) =>
  `/${locale}${path}`

export const isDashboardPathActive = (
  pathname: string,
  locale: string,
  path: string,
) => {
  const normalizedPath = stripLocalePrefix(pathname, locale)

  if (path === '/dashboard') {
    return normalizedPath === '/dashboard'
  }

  return (
    normalizedPath === path ||
    normalizedPath.startsWith(`${path}/`) ||
    normalizedPath.startsWith(`${path}#`)
  )
}

export const resolveDashboardTitleKey = (pathname: string, locale: string) => {
  const normalizedPath = stripLocalePrefix(pathname, locale)

  if (normalizedPath.startsWith('/notifications/')) {
    return 'dashboard.header.titles.notificationDetails'
  }

  if (normalizedPath.startsWith('/notifications')) {
    return 'dashboard.header.titles.notifications'
  }

  if (normalizedPath.startsWith('/profile')) {
    return 'dashboard.header.titles.profile'
  }

  if (normalizedPath.startsWith('/security')) {
    return 'dashboard.header.titles.security'
  }

  if (normalizedPath.startsWith('/preferences')) {
    return 'dashboard.header.titles.preferences'
  }

  if (normalizedPath.startsWith('/subscription')) {
    return 'dashboard.header.titles.subscription'
  }

  if (normalizedPath.startsWith('/danger')) {
    return 'dashboard.header.titles.danger'
  }

  if (normalizedPath.startsWith('/library')) {
    return 'dashboard.header.titles.library'
  }

  if (normalizedPath.startsWith('/wishlist')) {
    return 'dashboard.header.titles.library'
  }

  if (normalizedPath.startsWith('/books/')) {
    return 'dashboard.header.titles.library'
  }

  if (normalizedPath.startsWith('/reading')) {
    return 'dashboard.header.titles.reading'
  }

  if (normalizedPath.startsWith('/search')) {
    return 'dashboard.header.titles.search'
  }

  return 'dashboard.header.titles.dashboard'
}
