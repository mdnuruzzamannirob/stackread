import type { ReactNode } from 'react'

import { BookOpen } from 'lucide-react'

type HeroVariant = 'login' | 'forgot' | 'verify' | 'reset'

const HERO_STYLES: Record<HeroVariant, string> = {
  login:
    'bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.9)_100%),radial-gradient(circle_at_28%_22%,rgba(206,170,86,0.3),transparent_42%),repeating-linear-gradient(0deg,rgba(166,124,63,0.15)_0px,rgba(166,124,63,0.15)_2px,rgba(20,20,20,0.4)_2px,rgba(20,20,20,0.4)_58px),repeating-linear-gradient(90deg,rgba(180,150,88,0.1)_0px,rgba(180,150,88,0.1)_1px,transparent_1px,transparent_84px),linear-gradient(180deg,#3b2a18_0%,#1f1813_42%,#0b0b0b_100%)]',
  forgot:
    'bg-[linear-gradient(180deg,rgba(4,74,83,0.3)_0%,rgba(2,53,62,0.72)_62%,rgba(3,36,45,0.92)_100%),radial-gradient(circle_at_30%_18%,rgba(30,193,184,0.24),transparent_38%),repeating-linear-gradient(0deg,rgba(18,116,119,0.18)_0px,rgba(18,116,119,0.18)_2px,rgba(5,56,65,0.38)_2px,rgba(5,56,65,0.38)_58px),repeating-linear-gradient(90deg,rgba(34,148,146,0.12)_0px,rgba(34,148,146,0.12)_1px,transparent_1px,transparent_84px),linear-gradient(180deg,#0a646f_0%,#08545f_44%,#043741_100%)]',
  verify:
    'bg-[linear-gradient(180deg,rgba(4,54,68,0.34)_0%,rgba(2,45,56,0.72)_62%,rgba(2,35,45,0.92)_100%),radial-gradient(circle_at_30%_14%,rgba(31,198,201,0.18),transparent_34%),repeating-linear-gradient(0deg,rgba(9,96,113,0.2)_0px,rgba(9,96,113,0.2)_2px,rgba(2,48,63,0.42)_2px,rgba(2,48,63,0.42)_58px),repeating-linear-gradient(90deg,rgba(24,118,132,0.16)_0px,rgba(24,118,132,0.16)_1px,transparent_1px,transparent_84px),linear-gradient(180deg,#074d5b_0%,#044553_44%,#023a48_100%)]',
  reset:
    'bg-[linear-gradient(180deg,rgba(12,49,57,0.28)_0%,rgba(8,39,48,0.72)_66%,rgba(7,32,40,0.9)_100%),radial-gradient(circle_at_44%_16%,rgba(210,232,180,0.26),transparent_36%),repeating-linear-gradient(0deg,rgba(110,144,120,0.2)_0px,rgba(110,144,120,0.2)_2px,rgba(20,48,43,0.36)_2px,rgba(20,48,43,0.36)_58px),repeating-linear-gradient(90deg,rgba(164,190,167,0.12)_0px,rgba(164,190,167,0.12)_1px,transparent_1px,transparent_84px),linear-gradient(180deg,#5f796f_0%,#425a54_44%,#263c37_100%)]',
}

type AuthSplitShellProps = {
  brandLabel: string
  heroTitle: ReactNode
  heroDescription: string
  heroVariant: HeroVariant
  heading: string
  description: string
  children: ReactNode
  rightBottom?: ReactNode
  legalLinks?: string[]
}

export function AuthSplitShell({
  brandLabel,
  heroTitle,
  heroDescription,
  heroVariant,
  heading,
  description,
  children,
  rightBottom,
  legalLinks = ['Support', 'Privacy'],
}: AuthSplitShellProps) {
  return (
    <main className="min-h-screen bg-[#eceff1]">
      <section className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <aside
          className={`relative hidden overflow-hidden md:flex ${HERO_STYLES[heroVariant]}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(0,0,0,0.25),transparent_40%)]" />
          <div className="relative z-10 flex min-h-screen w-full flex-col p-10 text-white">
            <p className="flex items-center gap-2 text-[2rem] font-semibold leading-none">
              <BookOpen className="size-6" />
              <span className="text-[2rem]">{brandLabel}</span>
            </p>

            <div className="mt-auto max-w-md pb-14">
              <h1 className="text-6xl font-semibold leading-[1.02] tracking-[-0.03em]">
                {heroTitle}
              </h1>
              <p className="mt-7 text-3xl leading-relaxed text-white/90">
                {heroDescription}
              </p>
            </div>
          </div>
        </aside>

        <aside className="relative flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-105">
            <div className="space-y-2">
              <h2 className="text-5xl font-semibold tracking-[-0.02em] text-[#14191f]">
                {heading}
              </h2>
              <p className="text-lg leading-relaxed text-[#2d3844]">
                {description}
              </p>
            </div>

            <div className="mt-10">{children}</div>
            {rightBottom ? <div className="mt-8">{rightBottom}</div> : null}
          </div>

          <div className="absolute bottom-5 right-5 hidden rounded-full bg-white px-3 py-1 text-xs text-[#7b8591] md:flex md:items-center md:gap-3">
            {legalLinks.map((link, index) => (
              <span className="flex items-center gap-3" key={link}>
                <span>{link}</span>
                {index < legalLinks.length - 1 ? <span>•</span> : null}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
