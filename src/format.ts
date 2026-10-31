/** Pone en mayúscula la primera letra de cada palabra: "mr-mime" → "Mr Mime". */
export function capitalize(value: string): string {
  return value
    .split(/[-\s]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
