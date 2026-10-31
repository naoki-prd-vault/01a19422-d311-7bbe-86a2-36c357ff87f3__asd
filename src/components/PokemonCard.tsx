import { artworkUrl, idFromUrl } from '../api'
import { capitalize } from '../format'
import type { PokemonListItem } from '../types'

interface Props {
  item: PokemonListItem
  onSelect: (name: string) => void
}

export function PokemonCard({ item, onSelect }: Props) {
  const id = idFromUrl(item.url)

  return (
    <button
      type="button"
      className="card"
      onClick={() => onSelect(item.name)}
      aria-label={`Ver detalles de ${capitalize(item.name)}`}
    >
      <span className="card__id">#{String(id).padStart(3, '0')}</span>
      <img
        className="card__img"
        src={artworkUrl(id)}
        alt={capitalize(item.name)}
        loading="lazy"
        width={160}
        height={160}
      />
      <span className="card__name">{capitalize(item.name)}</span>
      <span className="card__cta">Ver ficha →</span>
    </button>
  )
}
