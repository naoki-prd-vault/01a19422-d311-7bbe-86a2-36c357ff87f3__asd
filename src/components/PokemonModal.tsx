import { useEffect, useState } from 'react'
import { fetchPokemonDetail } from '../api'
import type { PokemonDetail } from '../types'

interface Props {
  name: string
  onClose: () => void
}

const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}

const MAX_STAT = 200

export function PokemonModal({ name, onClose }: Props) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shiny, setShiny] = useState(false)

  useEffect(() => {
    let cancelled = false
    setDetail(null)
    setError(null)
    setShiny(false)

    fetchPokemonDetail(name)
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
        }
      })

    return () => {
      cancelled = true
    }
  }, [name])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [onClose])

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="sheet__close" onClick={onClose}>
          Cerrar ✕
        </button>

        {error && <p className="sheet__error">{error}</p>}

        {!detail && !error && <p className="sheet__loading">Cargando ficha…</p>}

        {detail && (
          <>
            <div className="sheet__head">
              <img
                className="sheet__img"
                src={shiny && detail.shinyImage ? detail.shinyImage : detail.image}
                alt={detail.name}
                width={220}
                height={220}
              />
              <div>
                <span className="sheet__id">#{String(detail.id).padStart(3, '0')}</span>
                <h2 className="sheet__name">{detail.name}</h2>
                <div className="chips">
                  {detail.types.map((type) => (
                    <span key={type} className={`chip type-${type}`}>
                      {type}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn--small"
                  onClick={() => setShiny((value) => !value)}
                >
                  {shiny ? 'Ver normal' : 'Ver variante shiny ✨'}
                </button>
              </div>
            </div>

            <div className="facts">
              <div className="fact">
                <span className="fact__label">Altura</span>
                <span className="fact__value">{(detail.height / 10).toFixed(1)} m</span>
              </div>
              <div className="fact">
                <span className="fact__label">Peso</span>
                <span className="fact__value">{(detail.weight / 10).toFixed(1)} kg</span>
              </div>
              <div className="fact">
                <span className="fact__label">Exp. base</span>
                <span className="fact__value">{detail.baseExperience ?? '—'}</span>
              </div>
            </div>

            <h3 className="sheet__subtitle">Estadísticas</h3>
            <ul className="stats">
              {detail.stats.map((stat) => (
                <li key={stat.name} className="stat">
                  <span className="stat__label">{STAT_LABELS[stat.name] ?? stat.name}</span>
                  <span className="stat__bar">
                    <span
                      className="stat__fill"
                      style={{ width: `${Math.min(100, (stat.value / MAX_STAT) * 100)}%` }}
                    />
                  </span>
                  <span className="stat__value">{stat.value}</span>
                </li>
              ))}
            </ul>

            <h3 className="sheet__subtitle">Habilidades</h3>
            <div className="chips">
              {detail.abilities.map((ability) => (
                <span key={ability} className="chip chip--neutral">
                  {ability}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
