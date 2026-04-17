import { withQuery } from '@/lib/api/query'
import type { ApiEnvelope, ApiListParams } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type Review = {
  id: string
  userId: string
  bookId: string
  rating: number
  title?: string
  comment: string
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export type ReviewListParams = ApiListParams

export type CreateReviewBody = {
  rating: number
  title?: string
  comment: string
}

export type UpdateReviewBody = Partial<CreateReviewBody>

type BookScopedReviewListParam = {
  bookId: string
  params?: ReviewListParams
}

type CreateReviewParam = {
  bookId: string
  body: CreateReviewBody
}

type UpdateReviewParam = {
  bookId: string
  reviewId: string
  body: UpdateReviewBody
}

type DeleteReviewParam = {
  bookId: string
  reviewId: string
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookReviews: builder.query<
      ApiEnvelope<Review[]>,
      BookScopedReviewListParam
    >({
      query: ({ bookId, params }) => ({
        url: withQuery(`/books/${bookId}/reviews`, params),
        method: 'GET',
      }),
      providesTags: (_result, _error, { bookId }) => [
        { type: 'Review', id: `BOOK_${bookId}` },
      ],
    }),
    createReview: builder.mutation<ApiEnvelope<Review>, CreateReviewParam>({
      query: ({ bookId, body }) => ({
        url: `/books/${bookId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Review', id: `BOOK_${bookId}` },
        { type: 'Book', id: bookId },
      ],
    }),
    updateReview: builder.mutation<ApiEnvelope<Review>, UpdateReviewParam>({
      query: ({ bookId, reviewId, body }) => ({
        url: `/books/${bookId}/reviews/${reviewId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Review', id: `BOOK_${bookId}` },
        { type: 'Book', id: bookId },
      ],
    }),
    deleteReview: builder.mutation<ApiEnvelope<Review>, DeleteReviewParam>({
      query: ({ bookId, reviewId }) => ({
        url: `/books/${bookId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Review', id: `BOOK_${bookId}` },
        { type: 'Book', id: bookId },
      ],
    }),
  }),
})

export const {
  useGetBookReviewsQuery,
  useLazyGetBookReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi
