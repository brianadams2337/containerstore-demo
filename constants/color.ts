export const ColorMap: Record<string, { id: number; hex: string | string[] }> =
  {
    WHITE: { id: 6, hex: '#ffffff' },
    BLACK: { id: 7, hex: '#000000' },
    GRAY: { id: 8, hex: '#888888' },
    DARK_GRAY: { id: 611, hex: '#808080' },
    RED: { id: 9, hex: '#a52a2a' },
    BLUE: { id: 10, hex: '#0000ff' },
    BRIGHT_GREEN: { id: 11, hex: '#00ff00' },
    BRIGHT_YELLOW: { id: 12, hex: '#ffff00' },
    BRIGHT_RED: { id: 13, hex: '#ff0000' },
    DULL_PINK: { id: 62, hex: '#ffc0cb' },
    YELLOW: { id: 594, hex: '#ffd700' },
    MIX: { id: 1370, hex: ['#0000ff', '#ffa500', '#ff0000', '#008000'] },
  }

export const AlphaColorMap = {
  ALPHA_0: 0,
  ALPHA_5: 5,
  ALPHA_10: 10,
  ALPHA_20: 20,
  ALPHA_30: 30,
  ALPHA_40: 40,
  ALPHA_50: 50,
  ALPHA_60: 60,
  ALPHA_70: 70,
  ALPHA_80: 80,
  ALPHA_90: 90,
  ALPHA_100: 100,
} as const
