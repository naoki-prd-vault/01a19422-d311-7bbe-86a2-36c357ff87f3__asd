export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonStat {
  name: string
  value: number
}

export interface PokemonDetail {
  id: number
  name: string
  image: string
  shinyImage: string | null
  types: string[]
  height: number
  weight: number
  baseExperience: number
  stats: PokemonStat[]
  abilities: string[]
}

export interface PokemonPage {
  items: PokemonListItem[]
  total: number
}
