/**
 * @see https://stackoverflow.com/a/30867255/11761617
 */
export function startsWith(
  string: string,
  value: string,
  position: number = 0
) {
  return string.indexOf(value, position) === position
}

export function isAspectRatio(value: string) {
  return /^\d+:\d+$/.test(value)
}
