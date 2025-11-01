type ColorName = 'blue' | 'lilac' | 'green' | 'magenta' | 'pale' | 'indigo';

export const globalColors: Record<ColorName, string> = {
  "blue": "rgba(56, 173, 241)",
  "lilac": "rgba(120, 82, 247)",
  "green": "rgba(4, 148, 164)",
  "magenta": "rgba(148, 76, 158)",
  "pale": "rgba(214, 201, 229)",
  "indigo": "rgba(36, 36, 68)"
}

export const addGlobalColor = (colorName: ColorName, value: string) => {
  globalColors[colorName] = value;
}