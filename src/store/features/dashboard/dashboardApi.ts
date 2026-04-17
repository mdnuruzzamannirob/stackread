import { withQuery } from '@/lib/api/query'
import type { ApiEnvelope, ApiListParams } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type DashboardStats = {
  readingStats: {
    totalBooksRead: number
    booksCurrentlyReading: number
    totalReadingTime: number
    averageRatingGiven: number
  }
  accessStats: {
    totalBooksAccessed: number
    currentlyReading: number
  }
  subscriptionStats: {
    currentPlan: string | null
    daysRemaining: number
    isActive: boolean
    renewalDate: string | null
  }
  libraryStats: {
    wishlistCount: number
    totalReviews: number
  }
}

export type DashboardRecommendation = {
  id: string
  title: string
  description: string | null
  authorIds: string[]
  categoryIds: string[]
  reason: string | null
  coverImage: {
    publicId: string
    url: string
  } | null
  ratingAverage: number
  ratingCount: number
}

export type DashboardHome = {
  stats: DashboardStats
  recommendations: DashboardRecommendation[]
}

export type DashboardLibraryItem = {
  id: string
  title: string
  description: string | null
  authorIds: string[]
  categoryIds: string[]
  coverImage: {
    provider: 'cloudinary'
    publicId: string
    url: string
    width?: number
    height?: number
  } | null
  ratingAverage: number
  ratingCount: number
  readingStatus: string
  lastAccessed: string | null
  progress: number
  type: 'reading'
}

export type DashboardHomeParams = {
  limit?: number
}

export type DashboardRecommendationsParams = {
  limit?: number
}

export type DashboardLibraryParams = ApiListParams

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardHome: builder.query<
      ApiEnvelope<DashboardHome>,
      DashboardHomeParams | void
    >({
      query: (params) => ({
        url: withQuery('/dashboard', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Dashboard', id: 'HOME' }],
    }),
    getDashboardStats: builder.query<ApiEnvelope<DashboardStats>, void>({
      query: () => ({
        url: '/dashboard/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Dashboard', id: 'STATS' }],
    }),
    getDashboardRecommendations: builder.query<
      ApiEnvelope<DashboardRecommendation[]>,
      DashboardRecommendationsParams | void
    >({
      query: (params) => ({
        url: withQuery('/dashboard/recommendations', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Dashboard', id: 'RECOMMENDATIONS' }],
    }),
    getMyLibrary: builder.query<
      ApiEnvelope<DashboardLibraryItem[]>,
      DashboardLibraryParams | void
    >({
      query: (params) => ({
        url: withQuery('/dashboard/library', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Dashboard', id: 'LIBRARY' }],
    }),
  }),
})

export const {
  useGetDashboardHomeQuery,
  useLazyGetDashboardHomeQuery,
  useGetDashboardStatsQuery,
  useGetDashboardRecommendationsQuery,
  useGetMyLibraryQuery,
  useLazyGetMyLibraryQuery,
} = dashboardApi
