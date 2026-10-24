import { useEffect, useState } from 'react'

// Asana's measured task-completion rainbow (docs/asana-tokens.json).
const RAINBOW = ['#805bee', '#f32822', '#e9c300', '#46a75a', '#2c60b8', '#d7b500']
// A flying friend glides across the screen, Asana-style.
const CREATURES = ['🦄', '🐤', '🎉', '✨', '🚀', '🌈', '⭐️', '🦋', '🐙', '🎊']

type Particle = {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  size: number
  rotate: number
  drift: number
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Fires a one-shot confetti burst + a creature fly-across each time `trigger`
 * changes (on a task completing). Full-screen, pointer-events-none, auto-clears.
 */
export function CompletionCelebration({ trigger }: { trigger: number }) {
  const [burst, setBurst] = useState<{ key: number; particles: Particle[]; creature: string } | null>(null)

  useEffect(() => {
    if (trigger === 0 || prefersReducedMotion()) {
      return
    }

    const particles: Particle[] = Array.from({ length: 52 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 0.15,
      duration: 0.9 + Math.random() * 0.8,
      color: RAINBOW[index % RAINBOW.length],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 180,
    }))
    const creature = CREATURES[Math.floor(Math.random() * CREATURES.length)]

    setBurst({ key: trigger, particles, creature })
    const timer = setTimeout(() => setBurst(null), 1700)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!burst) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 350 }} aria-hidden="true">
      {burst.particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute block rounded-[1px]"
          style={{
            left: `${particle.left}%`,
            top: '-6%',
            width: `${particle.size}px`,
            height: `${particle.size * 0.6}px`,
            background: particle.color,
            ['--finito-drift' as string]: `${particle.drift}px`,
            ['--finito-spin' as string]: `${particle.rotate}deg`,
            animation: `finito-confetti ${particle.duration}s cubic-bezier(0.3, 0.6, 0.4, 1) ${particle.delay}s forwards`,
          }}
        />
      ))}
      <span
        className="absolute select-none text-[44px]"
        style={{ top: '36%', left: '-12%', animation: 'finito-creature 1.4s cubic-bezier(0.4, 0, 0.6, 1) forwards' }}
      >
        {burst.creature}
      </span>
    </div>
  )
}
