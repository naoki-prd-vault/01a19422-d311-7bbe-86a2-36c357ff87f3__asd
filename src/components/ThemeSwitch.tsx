import type { Theme } from '../useTheme'

interface Props {
  theme: Theme
  onToggle: () => void
}

export function ThemeSwitch({ theme, onToggle }: Props) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-switch"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
      onClick={onToggle}
    >
      <span className="theme-switch__icon" aria-hidden="true">
        {isDark ? '☾' : '☀'}
      </span>
      <span className="theme-switch__track" aria-hidden="true">
        <span className="theme-switch__thumb" />
      </span>
    </button>
  )
}
