// Curated theme catalog. Each preset carries an `environment` label
// plus a `cues` array of visual elements; the generated prompt renders
// them as two adjacent sentences ("Set this float in a … environment.
// Visual cues: …, …, …."). Custom themes are handled outside the
// catalog — see FloatForm's "Or Create Your Own Theme" section.

export const THEME_GROUPS = [
  {
    id: 'growth-and-belonging',
    label: 'Growth & Belonging',
    themes: [
      {
        id: 'let-love-grow',
        label: 'Let Love Grow',
        environment: 'Botanical Garden',
        cues: [
          'floral arches',
          'topiary hearts',
          'butterflies',
          'greenhouse structures',
          'blooming pathways',
        ],
      },
      {
        id: 'rooted-in-pride',
        label: 'Rooted in Pride',
        environment: 'Enchanted Forest',
        cues: [
          'giant trees',
          'root systems',
          'flowering canopies',
          'woodland pathways',
          'treehouse-inspired structures',
        ],
      },
      {
        id: 'bloom-where-you-belong',
        label: 'Bloom Where You Belong',
        environment: 'Conservatory Garden',
        cues: [
          'ornate gardens',
          'floral sculptures',
          'fountains',
          'climbing vines',
          'garden gates',
        ],
      },
    ],
  },
  {
    id: 'light-and-visibility',
    label: 'Light & Visibility',
    themes: [
      {
        id: 'be-seen',
        label: 'Be Seen',
        environment: 'Lantern Festival',
        cues: [
          'floating lanterns',
          'illuminated pathways',
          'beacon towers',
          'stars',
          'constellations',
          'glowing architectural elements',
        ],
      },
    ],
  },
  {
    id: 'connection-and-community',
    label: 'Connection & Community',
    themes: [
      {
        id: 'stronger-together',
        label: 'Stronger Together',
        environment: 'Woven Village',
        cues: [
          'interconnected structures',
          'woven canopies',
          'linked arches',
          'connected courtyards',
          'communal gathering spaces',
        ],
      },
      {
        id: 'connected-by-community',
        label: 'Connected by Community',
        environment: 'Mosaic Plaza',
        cues: [
          'stained glass structures',
          'mosaic pathways',
          'geometric arches',
          'interconnected artwork',
          'colorful gathering spaces',
        ],
      },
    ],
  },
]

export function findThemeById(id) {
  if (!id) return null
  for (const group of THEME_GROUPS) {
    const match = group.themes.find((t) => t.id === id)
    if (match) return match
  }
  return null
}
