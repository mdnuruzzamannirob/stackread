import { withQuery } from '@/lib/api/query'
import type { ApiEnvelope, ApiListParams } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type WishlistItem = {
  id: string
  userId: string
  bookId: string
  createdAt: string
  updatedAt: string
}

export type WishlistParams = ApiListParams

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWishlist: builder.query<
      ApiEnvelope<WishlistItem[]>,
      WishlistParams | void
    >({
      query: (params) => ({
        url: withQuery('/wishlist', params ?? undefined),
        method: 'GET',
      }),
      providesTags: (result) => {
        const baseTags = [{ type: 'Wishlist' as const, id: 'LIST' }]

        if (!result?.data) {
          return baseTags
        }

        return [
          ...baseTags,
          ...result.data.map((item) => ({
            type: 'Wishlist' as const,
            id: item.bookId,
          })),
        ]
      },
    }),
    addToWishlist: builder.mutation<
      ApiEnvelope<WishlistItem>,
      { bookId: string }
    >({
      query: ({ bookId }) => ({
        url: `/wishlist/${bookId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Wishlist', id: 'LIST' },
        { type: 'Wishlist', id: bookId },
        { type: 'Book', id: bookId },
      ],
    }),
    removeFromWishlist: builder.mutation<ApiEnvelope<null>, { bookId: string }>(
      {
        query: ({ bookId }) => ({
          url: `/wishlist/${bookId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (_result, _error, { bookId }) => [
          { type: 'Wishlist', id: 'LIST' },
          { type: 'Wishlist', id: bookId },
          { type: 'Book', id: bookId },
        ],
      },
    ),
  }),
})

export const {
  useGetMyWishlistQuery,
  useLazyGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi
