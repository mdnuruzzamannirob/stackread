import { withQuery } from '@/lib/api/query'
import type { ApiEnvelope, ApiListParams } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type ReadingStatus = 'currently-reading' | 'completed'

export type ReadingProgress = {
  id: string
  userId: string
  bookId: string
  currentFileId?: string
  currentPage?: number
  progressPercentage: number
  status: ReadingStatus
  startedAt: string
  lastReadAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export type ReadingSession = {
  id: string
  userId: string
  bookId: string
  fileId?: string
  startedAt: string
  endedAt: string
  durationSeconds: number
  progressDelta: number
  device?: string
  createdAt: string
  updatedAt: string
}

export type ReadingBookmark = {
  id: string
  userId: string
  bookId: string
  fileId?: string
  location: string
  page?: number
  note?: string
  createdAt: string
  updatedAt: string
}

export type ReadingHighlight = {
  id: string
  userId: string
  bookId: string
  fileId?: string
  startOffset: number
  endOffset: number
  selectedText: string
  color: string
  note?: string
  createdAt: string
  updatedAt: string
}

export type StartReadingBody = {
  currentFileId?: string
  currentPage?: number
}

export type CreateReadingSessionBody = {
  fileId?: string
  startedAt: string
  endedAt: string
  progressDelta: number
  device?: string
}

export type UpdateReadingProgressBody = {
  currentFileId?: string
  currentPage?: number
  progressPercentage: number
  status?: ReadingStatus
}

export type CreateBookmarkBody = {
  fileId?: string
  location: string
  page?: number
  note?: string
}

export type UpdateBookmarkBody = Partial<CreateBookmarkBody>

export type CreateHighlightBody = {
  fileId?: string
  startOffset: number
  endOffset: number
  selectedText: string
  color?: string
  note?: string
}

export type UpdateHighlightBody = Partial<CreateHighlightBody>

export type PaginationParams = ApiListParams

export type BookScopedParam = {
  bookId: string
}

export type BookAndEntityParam = {
  bookId: string
  id: string
}

export type StartReadingParam = BookScopedParam & {
  body: StartReadingBody
}

export type CreateReadingSessionParam = BookScopedParam & {
  body: CreateReadingSessionBody
}

export type UpdateReadingProgressParam = BookScopedParam & {
  body: UpdateReadingProgressBody
}

export type CreateBookmarkParam = BookScopedParam & {
  body: CreateBookmarkBody
}

export type UpdateBookmarkParam = BookAndEntityParam & {
  body: UpdateBookmarkBody
}

export type CreateHighlightParam = BookScopedParam & {
  body: CreateHighlightBody
}

export type UpdateHighlightParam = BookAndEntityParam & {
  body: UpdateHighlightBody
}

export const readingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startReading: builder.mutation<
      ApiEnvelope<ReadingProgress>,
      StartReadingParam
    >({
      query: ({ bookId, body }) => ({
        url: `/reading/${bookId}/start`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `PROGRESS_${bookId}` },
        { type: 'Reading', id: 'HISTORY' },
        { type: 'Reading', id: 'CURRENT' },
      ],
    }),
    createReadingSession: builder.mutation<
      ApiEnvelope<ReadingSession>,
      CreateReadingSessionParam
    >({
      query: ({ bookId, body }) => ({
        url: `/reading/${bookId}/session`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `PROGRESS_${bookId}` },
        { type: 'Reading', id: 'HISTORY' },
      ],
    }),
    updateReadingProgress: builder.mutation<
      ApiEnvelope<ReadingProgress>,
      UpdateReadingProgressParam
    >({
      query: ({ bookId, body }) => ({
        url: `/reading/${bookId}/progress`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `PROGRESS_${bookId}` },
        { type: 'Reading', id: 'HISTORY' },
        { type: 'Reading', id: 'CURRENT' },
        { type: 'Reading', id: 'COMPLETED' },
      ],
    }),
    getReadingHistory: builder.query<
      ApiEnvelope<ReadingProgress[]>,
      PaginationParams | void
    >({
      query: (params) => ({
        url: withQuery('/reading/history', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Reading', id: 'HISTORY' }],
    }),
    getCurrentlyReading: builder.query<
      ApiEnvelope<ReadingProgress[]>,
      PaginationParams | void
    >({
      query: (params) => ({
        url: withQuery('/reading/currently-reading', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Reading', id: 'CURRENT' }],
    }),
    getCompletedReading: builder.query<
      ApiEnvelope<ReadingProgress[]>,
      PaginationParams | void
    >({
      query: (params) => ({
        url: withQuery('/reading/completed', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'Reading', id: 'COMPLETED' }],
    }),
    getBookmarks: builder.query<
      ApiEnvelope<ReadingBookmark[]>,
      BookScopedParam
    >({
      query: ({ bookId }) => ({
        url: `/books/${bookId}/bookmarks`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `BOOKMARKS_${bookId}` },
      ],
    }),
    createBookmark: builder.mutation<
      ApiEnvelope<ReadingBookmark>,
      CreateBookmarkParam
    >({
      query: ({ bookId, body }) => ({
        url: `/books/${bookId}/bookmarks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `BOOKMARKS_${bookId}` },
      ],
    }),
    updateBookmark: builder.mutation<
      ApiEnvelope<ReadingBookmark>,
      UpdateBookmarkParam
    >({
      query: ({ bookId, id, body }) => ({
        url: `/books/${bookId}/bookmarks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `BOOKMARKS_${bookId}` },
      ],
    }),
    deleteBookmark: builder.mutation<ApiEnvelope<null>, BookAndEntityParam>({
      query: ({ bookId, id }) => ({
        url: `/books/${bookId}/bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `BOOKMARKS_${bookId}` },
      ],
    }),
    getHighlights: builder.query<
      ApiEnvelope<ReadingHighlight[]>,
      BookScopedParam
    >({
      query: ({ bookId }) => ({
        url: `/books/${bookId}/highlights`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `HIGHLIGHTS_${bookId}` },
      ],
    }),
    createHighlight: builder.mutation<
      ApiEnvelope<ReadingHighlight>,
      CreateHighlightParam
    >({
      query: ({ bookId, body }) => ({
        url: `/books/${bookId}/highlights`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `HIGHLIGHTS_${bookId}` },
      ],
    }),
    updateHighlight: builder.mutation<
      ApiEnvelope<ReadingHighlight>,
      UpdateHighlightParam
    >({
      query: ({ bookId, id, body }) => ({
        url: `/books/${bookId}/highlights/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `HIGHLIGHTS_${bookId}` },
      ],
    }),
    deleteHighlight: builder.mutation<ApiEnvelope<null>, BookAndEntityParam>({
      query: ({ bookId, id }) => ({
        url: `/books/${bookId}/highlights/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: 'Reading', id: `HIGHLIGHTS_${bookId}` },
      ],
    }),
  }),
})

export const {
  useStartReadingMutation,
  useCreateReadingSessionMutation,
  useUpdateReadingProgressMutation,
  useGetReadingHistoryQuery,
  useGetCurrentlyReadingQuery,
  useGetCompletedReadingQuery,
  useGetBookmarksQuery,
  useCreateBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
  useGetHighlightsQuery,
  useCreateHighlightMutation,
  useUpdateHighlightMutation,
  useDeleteHighlightMutation,
} = readingApi
