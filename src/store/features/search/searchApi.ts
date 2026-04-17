import { withQuery } from '@/lib/api/query'
import type { ApiEnvelope, ApiListParams } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type SearchBookResult = {
  id: string
  title: string
  description: string | null
  authorIds: string[]
  categoryIds: string[]
  isbn: string | null
  publishedYear: number | null
  ratingAverage: number
  ratingCount: number
  pageCount: number
  language: string | null
  coverImage: {
    provider: 'cloudinary'
    publicId: string
    url: string
    width?: number
    height?: number
  } | null
}

export type SearchSuggestion = {
  text: string
  frequency: number
}

export type PopularSearchTerm = {
  term: string
  searchCount: number
  lastSearched: string
}

export type SearchHistoryItem = {
  query: string
  timestamp: string | null
}

export type SearchBooksParams = ApiListParams & {
  q: string
}

export type SearchSuggestionsParams = {
  q: string
  limit?: number
}

export type PopularTermsParams = {
  period?: 'day' | 'week' | 'month' | 'all'
  limit?: number
}

export type SearchHistoryParams = {
  limit?: number
}

export type LogSearchClickBody = {
  query: string
  bookId?: string
}

export type SearchLogClickResult = {
  id: string
  recorded: boolean
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchBooks: builder.query<
      ApiEnvelope<SearchBookResult[]>,
      SearchBooksParams
    >({
      query: (params) => ({
        url: withQuery('/search', params),
        method: 'GET',
      }),
      providesTags: [{ type: 'Search', id: 'RESULTS' }],
    }),
    getSearchSuggestions: builder.query<
      ApiEnvelope<SearchSuggestion[]>,
      SearchSuggestionsParams
    >({
      query: (params) => ({
        url: withQuery('/search/suggestions', params),
        method: 'GET',
      }),
      providesTags: [{ type: 'Search', id: 'SUGGESTIONS' }],
    }),
    getPopularSearchTerms: builder.query<
      ApiEnvelope<PopularSearchTerm[]>,
      PopularTermsParams | void
    >({
      query: (params) => ({
        url: withQuery('/search/popular-terms', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Search', id: 'POPULAR_TERMS' }],
    }),
    logSearchClick: builder.mutation<
      ApiEnvelope<SearchLogClickResult>,
      LogSearchClickBody
    >({
      query: (body) => ({
        url: '/search/log-click',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Search', id: 'POPULAR_TERMS' },
        { type: 'Search', id: 'HISTORY' },
      ],
    }),
    getSearchHistory: builder.query<
      ApiEnvelope<SearchHistoryItem[]>,
      SearchHistoryParams | void
    >({
      query: (params) => ({
        url: withQuery('/search/history', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),
  }),
})

export const {
  useSearchBooksQuery,
  useLazySearchBooksQuery,
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery,
  useGetPopularSearchTermsQuery,
  useLogSearchClickMutation,
  useGetSearchHistoryQuery,
  useLazyGetSearchHistoryQuery,
} = searchApi
