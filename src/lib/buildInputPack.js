import JSZip from 'jszip'
import INSTRUCTIONS_TEXT from './inputPackInstructions.js'
import { slugify } from './slugify.js'

// The pack contract: exactly these two PNGs ship inside every ZIP.
// Hard-coded in the fetch calls below (not pulled from `floatAssets.js`)
// because the input pack is a fixed user-facing contract — it should
// not change implicitly when the asset config evolves. Any pack
// contract change should be a deliberate edit to this module + the
// bundled instructions text.
//
// The pack ships only what ChatGPT needs to produce the complete float
// concept directly: the wheels-on-template structural reference and a
// style reference. Other assets in `public/assets/float/` stay on disk
// for reference but are not part of this contract.

const FALLBACK_FILENAME = 'pride-float-input-pack.zip'

// Throws on any non-OK response so a single failed asset short-circuits
// the entire pack build with a clear error path. The URL is taken from
// the response so the message remains accurate even after redirects.
async function ensureOkBlob(res) {
  if (!res.ok) {
    throw new Error('Failed to fetch input pack assets: ' + res.url)
  }
  return res.blob()
}

// Builds the ZIP that the user downloads. Resolves to { blob, filename }
// for the caller to wire into a download anchor. Throws on any asset
// fetch failure so the calling component can surface a clear "input
// pack failed" status row in the modal (or inline flash, for the
// standalone Download Input Pack action).
export async function buildInputPack({ prompt, theme } = {}) {
  const zip = new JSZip()

  zip.file('prompt.txt', prompt ?? '')
  zip.file('instructions.txt', INSTRUCTIONS_TEXT)

  // Two explicit, parallel fetches — see the contract note above for
  // why these paths are inlined rather than pulled from a config map.
  const [templateWithWheelsBlob, styleRefBlob] = await Promise.all([
    fetch('/assets/float/float_template_with_wheels.png').then(ensureOkBlob),
    fetch('/assets/float/float_style_reference.png').then(ensureOkBlob),
  ])

  zip.file('float_template_with_wheels.png', templateWithWheelsBlob)
  zip.file('float_style_reference.png', styleRefBlob)

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  // Filename: derived from the theme slug so each generation lands as
  // its own file. Falls back to a generic name when no theme is
  // provided (defensive — callers should always pass one).
  const themeSlug = (theme ?? '').trim() ? slugify(theme) : ''
  const filename = themeSlug
    ? `pride-float-input-pack-${themeSlug}.zip`
    : FALLBACK_FILENAME

  return { blob, filename }
}

export default buildInputPack
