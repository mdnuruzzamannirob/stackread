export type NotificationFilter =
  | 'All'
  | 'New Releases'
  | 'System Updates'
  | 'Reminders'

export type NotificationItem = {
  id: number
  group: 'Today' | 'Yesterday'
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

export const notificationFilters: Array<{
  label: NotificationFilter
  count: number
}> = [
  { label: 'All', count: 4 },
  { label: 'New Releases', count: 2 },
  { label: 'System Updates', count: 1 },
  { label: 'Reminders', count: 1 },
]

export const notificationItems: NotificationItem[] = [
  {
    id: 1,
    group: 'Today',
    filter: 'New Releases',
    badge: 'New Release',
    timestamp: '2 hours ago',
    title: 'Fresh Chapter Available: "The Midnight Library of Bengal"',
    description:
      'Author Anirban Roy has just uploaded Chapter 12: The Silent Echo. Start reading now to stay updated.',
    detailTitle: 'Chapter 12 is now available',
    detailBody:
      'A new chapter has been published for The Midnight Library of Bengal. Continue your reading journey and stay synced with the latest story arc from author Anirban Roy.',
    read: false,
    icon: 'book',
    primaryAction: 'Read Now',
    secondaryAction: 'Dismiss',
  },
  {
    id: 2,
    group: 'Today',
    filter: 'System Updates',
    badge: 'System',
    timestamp: '5 hours ago',
    title: 'Security Alert: New Login Detected',
    description:
      'A new login was recorded from a Chrome browser on Windows 11. Was this you?',
    detailTitle: 'Suspicious sign-in activity detected',
    detailBody:
      'We detected a new sign-in from Chrome on Windows 11. If this was not you, please secure your account immediately by resetting your password and reviewing active sessions.',
    read: false,
    icon: 'shield',
    primaryAction: 'Secure Account',
    secondaryAction: 'Yes, it was me',
  },
  {
    id: 3,
    group: 'Yesterday',
    filter: 'Reminders',
    badge: 'Reminder',
    timestamp: '1 day ago',
    title: 'Pick up where you left off',
    description:
      'You have not read "The River of Dreams" in 3 days. Your last bookmark is at page 142.',
    detailTitle: 'Continue your reading streak',
    detailBody:
      'Your current title has been waiting for you. Jump back to your saved bookmark and continue from page 142 to keep your reading momentum.',
    read: false,
    icon: 'clock',
    primaryAction: 'Resume Reading',
    secondaryAction: 'Later',
  },
  {
    id: 4,
    group: 'Yesterday',
    filter: 'New Releases',
    badge: 'Premium',
    timestamp: '1 day ago',
    title: 'Annual Subscription Discount',
    description:
      'Upgrade to our annual plan today and get 3 months of StackRead Premium for free. Limited time offer.',
    detailTitle: 'Limited-time annual plan offer',
    detailBody:
      'Get more value with an annual StackRead Premium subscription and unlock 3 bonus months at no extra cost. This offer is valid for a limited period only.',
    read: false,
    icon: 'sparkles',
    primaryAction: 'Claim Offer',
    secondaryAction: 'Not now',
  },
]
