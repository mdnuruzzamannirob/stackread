'use client'

import { Button } from '@/components/ui/button'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export function OAuthButtons() {
  const googleHref = `${apiBaseUrl}/auth/google`
  const facebookHref = `${apiBaseUrl}/auth/facebook`

  return (
    <div className="flex gap-2">
      <a href={googleHref} className="flex-1">
        <Button type="button" variant="outline" className="w-full">
          Continue with Google
        </Button>
      </a>
      <a href={facebookHref} className="flex-1">
        <Button type="button" variant="outline" className="w-full">
          Continue with Facebook
        </Button>
      </a>
    </div>
  )
}
