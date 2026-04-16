import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const genres = [
    { id: 1, name: 'Fiction', icon: '📖', color: 'from-blue-400 to-blue-600' },
    {
      id: 2,
      name: 'Poetry',
      icon: '✍️',
      color: 'from-purple-400 to-purple-600',
    },
    { id: 3, name: 'Drama', icon: '🎭', color: 'from-pink-400 to-pink-600' },
    {
      id: 4,
      name: 'History',
      icon: '📚',
      color: 'from-amber-400 to-amber-600',
    },
    { id: 5, name: 'Romance', icon: '💕', color: 'from-rose-400 to-rose-600' },
    {
      id: 6,
      name: 'Children',
      icon: '🎈',
      color: 'from-green-400 to-green-600',
    },
  ]

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'Lifetime',
      features: [
        'Access to 500+ Public Books',
        '1 Device at a time',
        'Offline Downloads',
      ],
      highlighted: false,
    },
    {
      name: 'Basic',
      price: 99,
      period: 'month',
      features: [
        'Access to 5,000+ Books',
        '3 Devices simultaneously',
        'Limited Offline Downloads',
        'Ad-free Experience',
      ],
      highlighted: true,
    },
    {
      name: 'Premium',
      price: 499,
      period: 'month',
      features: [
        'Unlimited Library Access',
        '10 Devices simultaneously',
        'Unlimited Downloads',
        'Audiobook Integration',
      ],
      highlighted: false,
    },
  ]

  const authorPicks = [
    {
      name: 'Sanchayita',
      author: 'Rabindranath Tagore',
      rating: 4.8,
      image: '👨',
    },
    {
      name: 'Pather Panchali',
      author: 'Bibhutibhushan Bandyopadhyay',
      rating: 4.9,
      image: '👨',
    },
    {
      name: 'Byomkesh Samagra',
      author: 'Sharadindu Bandyopadhyay',
      rating: 4.7,
      image: '👨',
    },
    {
      name: 'Teliandara',
      author: 'Rabindranath Roy',
      rating: 4.6,
      image: '👨',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                DIGITAL CURATOR
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              The Digital Curator of
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {' '}
                Bengali Literature
              </span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl">
              Immerse yourself in a curated library of classic and contemporary
              Bengali gems. From Tagore to modern thrillers, read anytime,
              anywhere.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2">
                <BookOpen size={18} />
                Start Reading Now
              </Button>
              <Button size="lg" variant="outline">
                Browse Books
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl border-2 border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-muted-foreground">
                  Beautiful Library Experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary md:text-5xl">
                10,000+
              </div>
              <p className="mt-2 text-muted-foreground">Bengali Books</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary md:text-5xl">
                500k+
              </div>
              <p className="mt-2 text-muted-foreground">Active Readers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-4xl font-bold text-primary md:text-5xl">
                <Star size={32} className="fill-primary" />
                4.9/5
              </div>
              <p className="mt-2 text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold tracking-tight">
              Explore Genres
            </h2>
            <p className="text-lg text-muted-foreground">
              Find your next favorite story across our diverse collection
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="text-4xl mb-3">{genre.icon}</div>
                <p className="font-semibold text-foreground">{genre.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Author Picks Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight">
                Curator's Monthly Picks
              </h2>
              <p className="text-lg text-muted-foreground">
                Handpicked masterpieces from Bengali literature
              </p>
            </div>
            <Link
              href="#"
              className="text-primary hover:underline font-medium hidden md:block"
            >
              View All →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {authorPicks.map((pick, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-border overflow-hidden bg-card hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="aspect-square bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
                  {pick.image}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-2">{pick.name}</h3>
                  <p className="text-sm text-muted-foreground">{pick.author}</p>
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-500 text-yellow-500"
                    />
                    <span className="text-sm font-medium">{pick.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold tracking-tight">
                Choose Your Path
              </h2>
              <p className="text-lg text-muted-foreground">
                Unlock the full potential of Bengali literature
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl border p-8 transition-all ${
                    plan.highlighted
                      ? 'border-primary bg-linear-to-b from-primary/5 to-primary/2 shadow-lg md:scale-105'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                          {plan.price === 0 ? 'Free' : `BDT ${plan.price}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground">
                            /{plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex gap-3">
                          <div className="text-primary">✓</div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.name === 'Free'
                        ? 'Get Started'
                        : `Choose ${plan.name}`}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="rounded-2xl border border-primary/30 bg-linear-to-r from-primary/10 to-secondary/10 p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to dive into Bengali literature?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join thousands of readers exploring the rich heritage of Bengali
            books
          </p>
          <Button size="lg" className="gap-2">
            <BookOpen size={18} />
            Create Your Free Account
          </Button>
        </div>
      </section>
    </div>
  )
}
