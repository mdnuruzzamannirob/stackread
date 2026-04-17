## Phase 1 Endpoint and DTO Matrix

This matrix locks the backend contract used by the web app data layer for Phase 1.

### Catalog Taxonomy and Books

| Backend Route      | Method | Auth   | Web Slice                       | Request DTO          | Response DTO                                         |
| ------------------ | ------ | ------ | ------------------------------- | -------------------- | ---------------------------------------------------- |
| /books             | GET    | Public | catalogApi.getPublicBooks       | ListBooksParams      | ApiEnvelope<PublicBook[]>                            |
| /books/featured    | GET    | Public | catalogApi.getFeaturedBooks     | void                 | ApiEnvelope<PublicBook[]>                            |
| /books/:id         | GET    | Public | catalogApi.getPublicBookById    | bookId: string       | ApiEnvelope<PublicBook>                              |
| /books/:id/preview | GET    | Public | catalogApi.getPublicBookPreview | bookId: string       | ApiEnvelope<PublicBookPreview>                       |
| /authors           | GET    | Public | catalogApi.getAuthors           | ListAuthorsParams    | ApiEnvelope<CatalogAuthor[]>                         |
| /authors/:id       | GET    | Public | catalogApi.getAuthorById        | authorId: string     | ApiEnvelope<CatalogAuthor>                           |
| /categories        | GET    | Public | catalogApi.getCategories        | ListCategoriesParams | ApiEnvelope<CatalogCategory[] \| CategoryTreeNode[]> |
| /categories/:id    | GET    | Public | catalogApi.getCategoryById      | categoryId: string   | ApiEnvelope<CatalogCategory>                         |
| /publishers        | GET    | Public | catalogApi.getPublishers        | ListPublishersParams | ApiEnvelope<CatalogPublisher[]>                      |
| /publishers/:id    | GET    | Public | catalogApi.getPublisherById     | publisherId: string  | ApiEnvelope<CatalogPublisher>                        |

### Search and Discovery

| Backend Route         | Method | Auth   | Web Slice                       | Request DTO             | Response DTO                      |
| --------------------- | ------ | ------ | ------------------------------- | ----------------------- | --------------------------------- |
| /search               | GET    | Public | searchApi.searchBooks           | SearchBooksParams       | ApiEnvelope<SearchBookResult[]>   |
| /search/suggestions   | GET    | Public | searchApi.getSearchSuggestions  | SearchSuggestionsParams | ApiEnvelope<SearchSuggestion[]>   |
| /search/popular-terms | GET    | Public | searchApi.getPopularSearchTerms | PopularTermsParams      | ApiEnvelope<PopularSearchTerm[]>  |
| /search/log-click     | POST   | User   | searchApi.logSearchClick        | LogSearchClickBody      | ApiEnvelope<SearchLogClickResult> |
| /search/history       | GET    | User   | searchApi.getSearchHistory      | SearchHistoryParams     | ApiEnvelope<SearchHistoryItem[]>  |

### Dashboard

| Backend Route              | Method | Auth | Web Slice                                | Request DTO                    | Response DTO                           |
| -------------------------- | ------ | ---- | ---------------------------------------- | ------------------------------ | -------------------------------------- |
| /dashboard                 | GET    | User | dashboardApi.getDashboardHome            | DashboardHomeParams            | ApiEnvelope<DashboardHome>             |
| /dashboard/stats           | GET    | User | dashboardApi.getDashboardStats           | void                           | ApiEnvelope<DashboardStats>            |
| /dashboard/recommendations | GET    | User | dashboardApi.getDashboardRecommendations | DashboardRecommendationsParams | ApiEnvelope<DashboardRecommendation[]> |
| /dashboard/library         | GET    | User | dashboardApi.getMyLibrary                | DashboardLibraryParams         | ApiEnvelope<DashboardLibraryItem[]>    |

### Reading and Library Activity

| Backend Route                 | Method | Auth | Web Slice                        | Request DTO                | Response DTO                    |
| ----------------------------- | ------ | ---- | -------------------------------- | -------------------------- | ------------------------------- |
| /reading/:bookId/start        | POST   | User | readingApi.startReading          | StartReadingParam          | ApiEnvelope<ReadingProgress>    |
| /reading/:bookId/session      | POST   | User | readingApi.createReadingSession  | CreateReadingSessionParam  | ApiEnvelope<ReadingSession>     |
| /reading/:bookId/progress     | PATCH  | User | readingApi.updateReadingProgress | UpdateReadingProgressParam | ApiEnvelope<ReadingProgress>    |
| /reading/history              | GET    | User | readingApi.getReadingHistory     | PaginationParams           | ApiEnvelope<ReadingProgress[]>  |
| /reading/currently-reading    | GET    | User | readingApi.getCurrentlyReading   | PaginationParams           | ApiEnvelope<ReadingProgress[]>  |
| /reading/completed            | GET    | User | readingApi.getCompletedReading   | PaginationParams           | ApiEnvelope<ReadingProgress[]>  |
| /books/:bookId/bookmarks      | GET    | User | readingApi.getBookmarks          | BookScopedParam            | ApiEnvelope<ReadingBookmark[]>  |
| /books/:bookId/bookmarks      | POST   | User | readingApi.createBookmark        | CreateBookmarkParam        | ApiEnvelope<ReadingBookmark>    |
| /books/:bookId/bookmarks/:id  | PATCH  | User | readingApi.updateBookmark        | UpdateBookmarkParam        | ApiEnvelope<ReadingBookmark>    |
| /books/:bookId/bookmarks/:id  | DELETE | User | readingApi.deleteBookmark        | BookAndEntityParam         | ApiEnvelope<null>               |
| /books/:bookId/highlights     | GET    | User | readingApi.getHighlights         | BookScopedParam            | ApiEnvelope<ReadingHighlight[]> |
| /books/:bookId/highlights     | POST   | User | readingApi.createHighlight       | CreateHighlightParam       | ApiEnvelope<ReadingHighlight>   |
| /books/:bookId/highlights/:id | PATCH  | User | readingApi.updateHighlight       | UpdateHighlightParam       | ApiEnvelope<ReadingHighlight>   |
| /books/:bookId/highlights/:id | DELETE | User | readingApi.deleteHighlight       | BookAndEntityParam         | ApiEnvelope<null>               |

### Wishlist and Reviews

| Backend Route              | Method | Auth   | Web Slice                      | Request DTO               | Response DTO                |
| -------------------------- | ------ | ------ | ------------------------------ | ------------------------- | --------------------------- |
| /wishlist                  | GET    | User   | wishlistApi.getMyWishlist      | WishlistParams            | ApiEnvelope<WishlistItem[]> |
| /wishlist/:bookId          | POST   | User   | wishlistApi.addToWishlist      | { bookId: string }        | ApiEnvelope<WishlistItem>   |
| /wishlist/:bookId          | DELETE | User   | wishlistApi.removeFromWishlist | { bookId: string }        | ApiEnvelope<null>           |
| /books/:bookId/reviews     | GET    | Public | reviewsApi.getBookReviews      | BookScopedReviewListParam | ApiEnvelope<Review[]>       |
| /books/:bookId/reviews     | POST   | User   | reviewsApi.createReview        | CreateReviewParam         | ApiEnvelope<Review>         |
| /books/:bookId/reviews/:id | PATCH  | User   | reviewsApi.updateReview        | UpdateReviewParam         | ApiEnvelope<Review>         |
| /books/:bookId/reviews/:id | DELETE | User   | reviewsApi.deleteReview        | DeleteReviewParam         | ApiEnvelope<Review>         |

### Promotions

| Backend Route       | Method | Auth   | Web Slice                         | Request DTO        | Response DTO                      |
| ------------------- | ------ | ------ | --------------------------------- | ------------------ | --------------------------------- |
| /coupons/validate   | POST   | Public | promotionsApi.validateCoupon      | ValidateCouponBody | ApiEnvelope<ValidateCouponResult> |
| /flash-sales/active | GET    | Public | promotionsApi.getActiveFlashSales | void               | ApiEnvelope<FlashSale[]>          |

### Shared API Utilities

- Shared envelope and pagination models are in src/lib/api/types.ts.
- Shared query-string builder is in src/lib/api/query.ts.
- Phase 1 domain tags are configured in src/store/baseApi.ts.
