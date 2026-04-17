import type { ApiEnvelope } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type UserNotificationType =
  | 'book_available'
  | 'subscription_expiring'
  | 'subscription_renewed'
  | 'review_response'
  | 'promotion_new'
  | 'system_message'

export type UserNotification = {
  id: string
  userId: string
  type: UserNotificationType
  title: string
  body: string
  relatedEntityId: string | null
  relatedEntityType: string | null
  read: boolean
  deliveredAt: string | null
  createdAt: string
  updatedAt: string
}

type NotificationsListParams = {
  page?: number
  limit?: number
  read?: boolean
}

type BulkMarkReadBody = {
  notificationIds: string[]
}

type BulkMarkReadResult = {
  matched: number
  updated: number
}

type UnreadCountResult = {
  unreadCount: number
}

const buildListQuery = (params?: NotificationsListParams) => {
  if (!params) {
    return '/notifications'
  }

  const query = new URLSearchParams()

  if (typeof params.page === 'number') {
    query.set('page', String(params.page))
  }

  if (typeof params.limit === 'number') {
    query.set('limit', String(params.limit))
  }

  if (typeof params.read === 'boolean') {
    query.set('read', params.read ? 'true' : 'false')
  }

  const serialized = query.toString()

  return serialized ? `/notifications?${serialized}` : '/notifications'
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<
      ApiEnvelope<UserNotification[]>,
      NotificationsListParams | void
    >({
      query: (params) => ({
        url: buildListQuery(params ?? undefined),
        method: 'GET',
      }),
      providesTags: (result) => {
        const baseTags = [
          { type: 'Notification' as const, id: 'LIST' },
          { type: 'Notification' as const, id: 'UNREAD_COUNT' },
        ]

        if (!result?.data) {
          return baseTags
        }

        return [
          ...baseTags,
          ...result.data.map((notification) => ({
            type: 'Notification' as const,
            id: notification.id,
          })),
        ]
      },
    }),
    getUnreadNotificationsCount: builder.query<
      ApiEnvelope<UnreadCountResult>,
      void
    >({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET',
      }),
      providesTags: [{ type: 'Notification', id: 'UNREAD_COUNT' }],
    }),
    markNotificationAsRead: builder.mutation<
      ApiEnvelope<UserNotification>,
      string
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD_COUNT' },
      ],
    }),
    bulkMarkNotificationsAsRead: builder.mutation<
      ApiEnvelope<BulkMarkReadResult>,
      BulkMarkReadBody
    >({
      query: (body) => ({
        url: '/notifications/mark-read',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD_COUNT' },
      ],
    }),
  }),
})

export const {
  useGetMyNotificationsQuery,
  useLazyGetMyNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationAsReadMutation,
  useBulkMarkNotificationsAsReadMutation,
} = notificationsApi
