'use client'

interface AuthHeroSectionProps {
  backgroundImage: string
  backgroundColor: string
  title: string
  description: string
}

const AuthHeroSection = ({
  backgroundImage,
  backgroundColor,
  title,
  description,
}: AuthHeroSectionProps) => {
  return (
    <section
      className={`fixed left-0 top-0 min-h-dvh w-1/2 ${backgroundColor} flex flex-col items-center justify-between p-8`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="text-sm font-medium text-white">StackRead</div>

      <div className="text-center space-y-4 max-w-sm">
        <h2 className="text-4xl font-bold leading-tight text-white">{title}</h2>
        <p className="text-lg text-gray-100">{description}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-300">
        <span>© 2024 StackRead</span>
      </div>
    </section>
  )
}

export default AuthHeroSection
