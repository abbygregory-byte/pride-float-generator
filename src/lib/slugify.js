// Tiny helper that turns a free-text input into a URL/filename-safe slug.
// Falls back to 'float' if the input doesn't have any alphanumeric chars.

export function slugify(s) {
  return (
    String(s ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'float'
  )
}
