import { withQuery } from '@/lib/api/query'
import type { ApiEnvelope, ApiListParams } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type BookLanguage = 'bn' | 'en' | 'hi'

export type BookAccessLevel = 'free' | 'basic' | 'premium'

export type BookStatus = 'draft' | 'published' | 'archived'

export type BookAvailabilityStatus = 'available' | 'unavailable' | 'coming_soon'

export type BookFileFormat = 'pdf' | 'epub' | 'mobi' | 'txt' | 'azw3'

export type BookCoverImage = {
  provider: 'cloudinary'
  publicId: string
  url: string
  width: number
  height: number
}

export type BookFile = {
  id: string
  provider: 'cloudinary'
  publicId: string
  url: string
  format: BookFileFormat
  resourceType: 'raw'
  size: number
  originalFileName: string
  uploadedAt: string
}

export type PublicBook = {
  id: string
  title: string
  slug: string
  isbn: string | null
  summary: string
  description: string | null
  language: BookLanguage
  pageCount: number | null
  publicationDate?: string
  coverImage: BookCoverImage | null
  edition: string | null
  featured: boolean
  availabilityStatus: BookAvailabilityStatus
  accessLevel: BookAccessLevel
  status: BookStatus
  authorIds: string[]
  categoryIds: string[]
  publisherId?: string
  tags: string[]
  files: BookFile[]
  ratingAverage: number
  ratingCount: number
  addedBy: string
  createdAt: string
  updatedAt: string
}

export type PublicBookPreview = {
  id: string
  title: string
  slug: string
  summary: string
  coverImage: BookCoverImage | null
  featured: boolean
  availabilityStatus: BookAvailabilityStatus
  authorIds: string[]
  categoryIds: string[]
  publicationDate?: string
  createdAt: string
  updatedAt: string
}

export type ListBooksParams = ApiListParams & {
  search?: string
  featured?: boolean
  status?: BookStatus
  availabilityStatus?: BookAvailabilityStatus
  authorId?: string
  categoryId?: string
  publisherId?: string
  accessLevel?: BookAccessLevel
  language?: BookLanguage
}

export type AuthorAvatar = {
  provider: 'cloudinary'
  publicId: string
  url: string
}

export type CatalogAuthor = {
  id: string
  name: string
  slug: string
  bio: string | null
  countryCode: string | null
  avatar: AuthorAvatar | null
  website: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ListAuthorsParams = ApiListParams & {
  search?: string
  isActive?: boolean
}

export type CatalogCategory = {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  parent_id?: string
  sortOrder: number
  isActive: boolean
  booksCount: number
  createdAt: string
  updatedAt: string
}

export type CategoryTreeNode = CatalogCategory & {
  children: CategoryTreeNode[]
}

export type ListCategoriesParams = ApiListParams & {
  search?: string
  includeInactive?: boolean
  tree?: boolean
  parentId?: string
}

export type PublisherLogo = {
  provider: 'cloudinary'
  publicId: string
  url: string
}

export type CatalogPublisher = {
  id: string
  name: string
  slug: string
  description: string | null
  website: string | null
  logo: PublisherLogo | null
  countryCode: string | null
  foundedYear: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ListPublishersParams = ApiListParams & {
  search?: string
  isActive?: boolean
}

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicBooks: builder.query<
      ApiEnvelope<PublicBook[]>,
      ListBooksParams | void
    >({
      query: (params) => ({
        url: withQuery('/books', params ?? undefined),
        method: 'GET',
      }),
      providesTags: (result) => {
        const baseTags = [{ type: 'Book' as const, id: 'LIST' }]

        if (!result?.data) {
          return baseTags
        }

        return [
          ...baseTags,
          ...result.data.map((book) => ({
            type: 'Book' as const,
            id: book.id,
          })),
        ]
      },
    }),
    getFeaturedBooks: builder.query<ApiEnvelope<PublicBook[]>, void>({
      query: () => ({
        url: '/books/featured',
        method: 'GET',
      }),
      providesTags: (result) => {
        const baseTags = [{ type: 'Book' as const, id: 'FEATURED' }]

        if (!result?.data) {
          return baseTags
        }

        return [
          ...baseTags,
          ...result.data.map((book) => ({
            type: 'Book' as const,
            id: book.id,
          })),
        ]
      },
    }),
    getPublicBookById: builder.query<ApiEnvelope<PublicBook>, string>({
      query: (bookId) => ({
        url: `/books/${bookId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, bookId) => [{ type: 'Book', id: bookId }],
    }),
    getPublicBookPreview: builder.query<ApiEnvelope<PublicBookPreview>, string>(
      {
        query: (bookId) => ({
          url: `/books/${bookId}/preview`,
          method: 'GET',
        }),
        providesTags: (_result, _error, bookId) => [
          { type: 'Book', id: bookId },
          { type: 'Book', id: `PREVIEW_${bookId}` },
        ],
      },
    ),
    getAuthors: builder.query<
      ApiEnvelope<CatalogAuthor[]>,
      ListAuthorsParams | void
    >({
      query: (params) => ({
        url: withQuery('/authors', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'CatalogTaxonomy', id: 'AUTHORS_LIST' }],
    }),
    getAuthorById: builder.query<ApiEnvelope<CatalogAuthor>, string>({
      query: (authorId) => ({
        url: `/authors/${authorId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, authorId) => [
        { type: 'CatalogTaxonomy', id: `AUTHOR_${authorId}` },
      ],
    }),
    getCategories: builder.query<
      ApiEnvelope<CatalogCategory[] | CategoryTreeNode[]>,
      ListCategoriesParams | void
    >({
      query: (params) => ({
        url: withQuery('/categories', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'CatalogTaxonomy', id: 'CATEGORIES_LIST' }],
    }),
    getCategoryById: builder.query<ApiEnvelope<CatalogCategory>, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, categoryId) => [
        { type: 'CatalogTaxonomy', id: `CATEGORY_${categoryId}` },
      ],
    }),
    getPublishers: builder.query<
      ApiEnvelope<CatalogPublisher[]>,
      ListPublishersParams | void
    >({
      query: (params) => ({
        url: withQuery('/publishers', params ?? undefined),
        method: 'GET',
      }),
      providesTags: [{ type: 'CatalogTaxonomy', id: 'PUBLISHERS_LIST' }],
    }),
    getPublisherById: builder.query<ApiEnvelope<CatalogPublisher>, string>({
      query: (publisherId) => ({
        url: `/publishers/${publisherId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, publisherId) => [
        { type: 'CatalogTaxonomy', id: `PUBLISHER_${publisherId}` },
      ],
    }),
  }),
})

export const {
  useGetPublicBooksQuery,
  useLazyGetPublicBooksQuery,
  useGetFeaturedBooksQuery,
  useGetPublicBookByIdQuery,
  useGetPublicBookPreviewQuery,
  useGetAuthorsQuery,
  useGetAuthorByIdQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetPublishersQuery,
  useGetPublisherByIdQuery,
} = catalogApi
