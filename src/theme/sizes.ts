export const height = {
  // 56 - home bar, search bar
  bar: 56,

  // 52 - text input (about token field)
  input: 52,

  // 48 - buttons (about save/remove)
  button: 48,

  // 4 - watch progress track
  progressTrack: 4,

  // 3 - status filter indicator
  indicator: 3,
} as const;

export const opacity = {
  // 0.7 - pressed (dialog, link rows, about, finish button)
  pressed: 0.7,

  // 0.6 - dimmed poster
  dimmed: 0.6,

  // 0.5 - upcoming episode
  upcoming: 0.5,

  // 0.4 - disabled button (0.3 for disabled episodes merged into this)
  disabled: 0.4,
} as const;
