export const fontSize = {
  // 11 - progress badge %, search result subtitle
  xxs: 11,

  // 12 - episode dates, poster placeholder text
  xs: 12,

  // 13 - poster names, search result names, details meta
  sm: 13,

  // 14 - body text (dialog message, about text, overview, link labels)
  md: 14,

  // 15 - episode names, text input
  lg: 15,

  // 16 - status filter tabs, search bar text, about headings
  xl: 16,

  // 20 - dialog title
  xxl: 20,

  // 22 - details title
  xxxl: 22,

  // 24 - about app name
  xxxxl: 24,
} as const;

export const fontWeight = {
  // the only weight the old app uses (20x)
  bold: "bold",
} as const;

export const lineHeight = {
  // 20 - used with md text (dialog message, about text, overview)
  md: 20,
} as const;
