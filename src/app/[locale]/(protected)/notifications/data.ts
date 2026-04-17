import type {
  UserNotification,
  UserNotificationType,
} from '@/store/features/notifications/notificationsApi'

export type NotificationFilter =
  | 'All'
  | 'Book Updates'
  | 'Subscription'
  | 'System Updates'
  | 'Reminders'
  | 'Promotions'

export type NotificationItem = {
  id: string
  type: UserNotificationType
  group: 'Today' | 'Earlier'
  filter: Exclude<NotificationFilter, 'All'>
  badge: string
  timestamp: string
  title: string
  description: string
  detailTitle: string
  detailBody: string
  read: boolean
  icon: 'book' | 'shield' | 'clock' | 'sparkles'
  primaryAction: string
  secondaryAction: string
}

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const relativeTimeDivisors: Array<{
  unit: Intl.RelativeTimeFormatUnit
  milliseconds: number
}> = [
  { unit: 'day', milliseconds: 24 * 60 * 60 * 1000 },
  { unit: 'hour', milliseconds: 60 * 60 * 1000 },
  { unit: 'minute', milliseconds: 60 * 1000 },
]

const mapTypeToFilter = (
  type: UserNotificationType,
): Exclude<NotificationFilter, 'All'> => {
  switch (type) {
    case 'book_available':
      return 'Book Updates'
    case 'subscription_expiring':
    case 'subscription_renewed':
      return 'Subscription'
    case 'review_response':
      return 'Reminders'
    case 'promotion_new':
      return 'Promotions'
    default:
      return 'System Updates'
  }
}

const mapTypeToBadge = (type: UserNotificationType) => {
  switch (type) {
    case 'book_available':
      return 'New Release'
    case 'subscription_expiring':
      return 'Renewal'
    case 'subscription_renewed':
      return 'Subscription'
    case 'review_response':
      return 'Reminder'
    case 'promotion_new':
      return 'Promotion'
    default:
      return 'System'
  }
}

const mapTypeToIcon = (
  type: UserNotificationType,
): NotificationItem['icon'] => {
  switch (type) {
    case 'book_available':
      return 'book'
    case 'review_response':
    case 'subscription_expiring':
      return 'clock'
    case 'system_message':
      return 'shield'
    default:
      return 'sparkles'
  }
}

const mapTypeToPrimaryAction = (type: UserNotificationType) => {
  switch (type) {
    case 'book_available':
      return 'Read now'
    case 'subscription_expiring':
      return 'Renew now'
    case 'subscription_renewed':
      return 'View details'
    case 'review_response':
      return 'Check activity'
    case 'promotion_new':
      return 'Claim offer'
    default:
      return 'Open notification'
  }
}

const toRelativeTime = (dateString: string) => {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return 'Just now'
  }

  const now = Date.now()
  const diff = date.getTime() - now
  const absolute = Math.abs(diff)

  for (const entry of relativeTimeDivisors) {
    if (absolute >= entry.milliseconds) {
      return relativeFormatter.format(
        Math.round(diff / entry.milliseconds),
        entry.unit,
      )
    }
  }

  return 'Just now'
}

const toGroup = (dateString: string): NotificationItem['group'] => {
  const date = new Date(dateString)
  const now = new Date()

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return 'Today'
  }

  return 'Earlier'
}

export const toNotificationItem = (
  notification: UserNotification,
): NotificationItem => {
  return {
    id: notification.id,
    type: notification.type,
    group: toGroup(notification.createdAt),
    filter: mapTypeToFilter(notification.type),
    badge: mapTypeToBadge(notification.type),
    timestamp: toRelativeTime(notification.createdAt),
    title: notification.title,
    description: notification.body,
    detailTitle: notification.title,
    detailBody: notification.body,
    read: notification.read,
    icon: mapTypeToIcon(notification.type),
    primaryAction: mapTypeToPrimaryAction(notification.type),
    secondaryAction: 'Dismiss',
  }
}

export const buildNotificationFilters = (items: NotificationItem[]) => {
  const orderedLabels: NotificationFilter[] = [
    'All',
    'Book Updates',
    'Subscription',
    'System Updates',
    'Reminders',
    'Promotions',
  ]

  return orderedLabels.map((label) => {
    if (label === 'All') {
      return {
        label,
        count: items.length,
      }
    }

    return {
      label,
      count: items.filter((item) => item.filter === label).length,
    }
  })
}
