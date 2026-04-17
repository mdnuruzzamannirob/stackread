import type { ApiEnvelope } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type CouponDiscountType = 'percentage' | 'fixed'

export type Coupon = {
  id: string
  code: string
  title: string
  description: string
  discountType: CouponDiscountType
  discountValue: number
  maxDiscountAmount?: number
  minOrderAmount: number
  totalLimit?: number
  usedCount: number
  applicablePlanIds: string[]
  isActive: boolean
  startsAt: string
  endsAt: string
  createdAt: string
  updatedAt: string
}

export type FlashSale = {
  id: string
  title: string
  description: string
  discountPercentage: number
  applicablePlanIds: string[]
  isActive: boolean
  startsAt: string
  endsAt: string
  createdAt: string
  updatedAt: string
}

export type ValidateCouponBody = {
  code: string
  planId: string
  amount: number
}

export type ValidateCouponResult = {
  valid: true
  coupon: Coupon
  discountAmount: number
  payableAmount: number
}

export const promotionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<
      ApiEnvelope<ValidateCouponResult>,
      ValidateCouponBody
    >({
      query: (body) => ({
        url: '/coupons/validate',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Promotion', id: 'COUPON_VALIDATION' }],
    }),
    getActiveFlashSales: builder.query<ApiEnvelope<FlashSale[]>, void>({
      query: () => ({
        url: '/flash-sales/active',
        method: 'GET',
      }),
      providesTags: [{ type: 'Promotion', id: 'FLASH_SALES_ACTIVE' }],
    }),
  }),
})

export const {
  useValidateCouponMutation,
  useGetActiveFlashSalesQuery,
  useLazyGetActiveFlashSalesQuery,
} = promotionsApi
