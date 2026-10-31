import type { PokemonDetail, PokemonPage } from './types'

const BASE_URL = 'https://pokeapi.co/api/v2'
const PAGE_SIZE = 24

interface RawListResponse {
  count: number
  results: { name: string; url: string }[]
}

interface RawPokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: { front_default: string | null }
      home?: { front_default: string | null }
    }
  }
  types: { slot: number; type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string } }[]
}

export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function shinyArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
}

export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}

export async function fetchPokemonPage(
  offset: number,
  limit = PAGE_SIZE,
): Promise<PokemonPage> {
  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`)
  if (!response.ok) {
    throw new Error(`No se pudo cargar la lista (${response.status})`)
  }
  const data = (await response.json()) as RawListResponse
  return { items: data.results, total: data.count }
}

export async function fetchPokemonDetail(
  nameOrId: string | number,
): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!response.ok) {
    throw new Error(`No se encontró ese Pokémon (${response.status})`)
  }
  const data = (await response.json()) as RawPokemon

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.other?.home?.front_default ??
      data.sprites.front_default ??
      artworkUrl(data.id),
    shinyImage: shinyArtworkUrl(data.id),
    types: data.types
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    stats: data.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
    abilities: data.abilities.map((entry) => entry.ability.name),
  }
}

export { PAGE_SIZE }
