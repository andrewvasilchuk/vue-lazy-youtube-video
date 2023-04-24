export const isAspectRatio = (value: string) => /^\d+:\d+$/.test(value)

export const toListenersWithOn = <T>(listeners: Record<string, T>) =>
  Object.fromEntries(
    Object.entries(listeners).map(([key, value]) => [
      `on${key[0].toUpperCase()}${key.slice(1)}`,
      value,
    ])
  )
