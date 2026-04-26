import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  CircleDollarSign,
  BookMarked,
  BookOpen,
  Compass,
  Heart,
  History,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  User,
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
    id: 'main',
    labelKey: 'dashboard.sidebar.sections.main',
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
        id: 'browse-explore',
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
    ],
  },
  {
    id: 'my-library',
    labelKey: 'dashboard.sidebar.sections.myLibrary',
    items: [
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
      },
      {
        id: 'currently-reading',
        labelKey: 'dashboard.sidebar.items.currentlyReading',
        path: '/reading/currently-reading',
        icon: Compass,
        availability: 'ready',
        backendRoutes: ['GET /reading/currently-reading'],
      },
      {
        id: 'saved',
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
      {
        id: 'reading-history',
        labelKey: 'dashboard.sidebar.items.readingHistory',
        path: '/reading/history',
        icon: History,
        availability: 'ready',
        backendRoutes: ['GET /reading/history'],
      },
    ],
  },
  {
    id: 'subscription',
    labelKey: 'dashboard.sidebar.sections.subscription',
    items: [
      {
        id: 'my-plan',
        labelKey: 'dashboard.sidebar.items.subscription',
        path: '/subscription',
        icon: CircleDollarSign,
        availability: 'ready',
        backendRoutes: [
          'GET /subscriptions/my',
          'GET /subscriptions/my/payments',
          'GET /subscriptions/my/payment-method',
        ],
      },
    ],
  },
  {
    id: 'account',
    labelKey: 'dashboard.sidebar.sections.account',
    items: [
      {
        id: 'profile',
        labelKey: 'dashboard.sidebar.items.profile',
        path: '/profile',
        icon: User,
        availability: 'ready',
        backendRoutes: [
          'GET /auth/me',
          'PATCH /auth/me',
          'PATCH /auth/me/profile-picture',
        ],
      },
      {
        id: 'preferences',
        labelKey: 'dashboard.sidebar.items.preferences',
        path: '/preferences',
        icon: Settings,
        availability: 'ready',
        backendRoutes: [
          'GET /auth/me',
          'PATCH /auth/me',
          'PATCH /auth/me/notification-preferences',
        ],
      },
      {
        id: 'security',
        labelKey: 'dashboard.sidebar.items.security',
        path: '/security',
        icon: Shield,
        availability: 'ready',
        backendRoutes: ['GET /auth/me', 'PATCH /auth/me'],
      },
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
