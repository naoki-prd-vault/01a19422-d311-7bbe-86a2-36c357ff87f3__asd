import { useCallback, useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE, fetchPokemonDetail, fetchPokemonPage } from './api'
import { PokemonCard } from './components/PokemonCard'
import { PokemonModal } from './components/PokemonModal'
import { ThemeSwitch } from './components/ThemeSwitch'
import type { PokemonListItem } from './types'
import { useTheme } from './useTheme'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [items, setItems] = useState<PokemonListItem[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)

  const loadPage = useCallback(async (nextOffset: number) => {
    setLoading(true)
    setError(null)
    try {
      const page = await fetchPokemonPage(nextOffset)
      setItems(page.items)
      setTotal(page.total)
      setOffset(nextOffset)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPage(0)
  }, [loadPage])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items
    return items.filter((item) => item.name.includes(term))
  }, [items, query])

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    const term = query.trim().toLowerCase()
    if (!term) return

    const exact = items.find((item) => item.name === term)
    if (exact) {
      setSelected(exact.name)
      return
    }

    setSearching(true)
    setError(null)
    try {
      const detail = await fetchPokemonDetail(term)
      setSelected(detail.name)
    } catch {
      setError(`No existe ningún Pokémon llamado “${term}”.`)
    } finally {
      setSearching(false)
    }
  }

  const pageNumber = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__top">
          <div className="hero__badge">POKÉDEX</div>
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />
        </div>
        <h1 className="hero__title">
          Pokédex <span className="hero__title-accent">/ PokeAPI</span>
        </h1>
        <p className="hero__subtitle">
          Datos en vivo de PokeAPI. Busca por nombre o explora la lista.
        </p>

        <form className="search" onSubmit={handleSearch}>
          <input
            className="search__input"
            type="search"
            placeholder="pikachu, charizard, 25…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar Pokémon"
          />
          <button className="btn" type="submit" disabled={searching}>
            {searching ? 'Buscando…' : 'Buscar'}
          </button>
        </form>
      </header>

      <main className="content">
        {error && <p className="alert">{error}</p>}

        {loading && (
          <div className="grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="card card--skeleton" />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="empty">
            Ningún Pokémon de esta página coincide con “{query}”. Prueba con otra
            página o pulsa Buscar.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid">
            {filtered.map((item) => (
              <PokemonCard key={item.url} item={item} onSelect={setSelected} />
            ))}
          </div>
        )}

        <nav className="pager" aria-label="Paginación">
          <button
            className="btn btn--ghost"
            type="button"
            disabled={offset === 0 || loading}
            onClick={() => void loadPage(Math.max(0, offset - PAGE_SIZE))}
          >
            ← Anterior
          </button>
          <span className="pager__info">
            Página {pageNumber} de {totalPages}
          </span>
          <button
            className="btn btn--ghost"
            type="button"
            disabled={offset + PAGE_SIZE >= total || loading}
            onClick={() => void loadPage(offset + PAGE_SIZE)}
          >
            Siguiente →
          </button>
        </nav>
      </main>

      <footer className="footer">
        Hecho con React + Vite · Datos de{' '}
        <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
          pokeapi.co
        </a>
      </footer>

      {selected && (
        <PokemonModal name={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

export default App
