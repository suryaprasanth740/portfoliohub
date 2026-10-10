import { motion } from 'framer-motion'
import { scrollToId } from '../../lib/scrollToId'

const SOCIAL_ICONS = {
  github: '🐙',
  linkedin: '💼',
  twitter: '🐦',
  website: '🌐',
}

export default function HeroSection({ profile, pdfButton }) {
  const socials = Object.entries(profile.socials || {}).filter(([, v]) => v)

  return (
    <header
      className="relative overflow-hidden border-b px-6 py-16 text-center sm:py-20"
      style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-surface)' }}
    >
      {/* Soft themed glow behind the header — purely decorative, follows
          whichever color theme the owner picked, and never intercepts clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(480px circle at 20% 15%, color-mix(in srgb, var(--ph-primary) 16%, transparent), transparent 65%), ' +
            'radial-gradient(420px circle at 82% 85%, color-mix(in srgb, var(--ph-accent) 14%, transparent), transparent 65%)',
        }}
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="mx-auto h-24 w-24 rounded-full object-cover shadow-md"
          />
        ) : (
          <div
            className="mx-auto grid h-24 w-24 place-items-center rounded-full text-3xl font-bold text-white shadow-md"
            style={{ background: 'var(--ph-primary)' }}
          >
            {profile.displayName?.[0]}
          </div>
        )}

        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--ph-text)' }}>
          {profile.displayName}
        </h1>
        <p className="mt-1 text-lg" style={{ color: 'var(--ph-primary)' }}>
          {profile.title}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--ph-muted)' }}>
          {profile.bio}
        </p>

        {socials.length > 0 && (
          <div className="mt-5 flex justify-center gap-3">
            {socials.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full text-base transition hover:-translate-y-0.5"
                style={{ background: 'var(--ph-surface-alt)' }}
                title={key}
              >
                {SOCIAL_ICONS[key]}
              </a>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('contact')
            }}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--ph-primary)' }}
          >
            Contact me
          </a>
          {pdfButton}
        </div>
      </motion.div>
    </header>
  )
}
