// Pure, synchronous prompt generator for the Pride at Zoro Float Studio.
// Emits an opener, theme-specific guidance (preset env+cues *or* a
// custom wrapper paragraph), then a fixed sequence of all-caps
// sections covering text restrictions, float structure, viewpoint,
// signage, Pride expression, background, presentation style, and
// content limits, closing with a summary block. Returns `null` when
// `theme` is empty after trim.
//
// TEXT RESTRICTIONS leads the section list because text leakage in
// generated images (welcome signs, road signs, decorative
// typography, etc.) was the dominant failure mode at preview, so we
// want it to be the first hard constraint ChatGPT reads after the
// theme framing.
//
// FLOAT STRUCTURE describes the parade-float form purely in text —
// the workflow no longer attaches a template image to the chat, so
// ChatGPT has to build its mental model of the flatbed + wheels +
// decorate-don't-replace constraint from this section alone.

const CUSTOM_THEME_EXPRESSION =
  'Use the custom theme visually through large-scale parade float decorations, sculptural elements, color, texture, props, and symbolic imagery. Make the concept polished, dimensional, family-friendly, and suitable for a corporate Pride event.'

export function generatePrompt({
  theme,
  environment = null,
  cues = null,
  isCustom = false,
} = {}) {
  const themeText = (theme ?? '').trim()

  if (!themeText) return null

  const lines = [
    `Design a Pride parade float concept for Zoro, themed "${themeText}".`,
    '',
  ]

  // Theme-specific guidance — preset themes get a two-line
  // environment + cues block, custom themes get the wrapper
  // paragraph. Both branches are then followed by an empty line so
  // the first section header is visually separated.
  const envLabel = (environment ?? '').trim()
  const cueList = Array.isArray(cues) ? cues.filter((c) => (c ?? '').trim()) : []
  if (isCustom) {
    lines.push(CUSTOM_THEME_EXPRESSION, '')
  } else if (envLabel && cueList.length > 0) {
    lines.push(
      `Set this float in a ${envLabel} environment.`,
      `Visual cues: ${cueList.join(', ')}.`,
      '',
    )
  }

  lines.push(
    'TEXT RESTRICTIONS',
    '- Do not render any text anywhere in the image.',
    '- Do not include signs with words.',
    '- Do not include road signs.',
    '- Do not include destination markers.',
    '- Do not include welcome signs.',
    '- Do not include labels.',
    '- Do not include banners.',
    '- Do not include posters.',
    '- Do not include placards.',
    '- Do not include slogans.',
    '- Do not include typography as decoration.',
    '- Do not include letters, numbers, symbols, or readable characters.',
    '- If signage is part of the selected environment, use blank decorative sign structures only.',
    '- Signs may exist as decorative objects but must remain completely blank.',
    '- The final image should contain zero readable text.',
    '',
    'FLOAT STRUCTURE',
    '- Design a single flatbed-style parade float with visible wheels at the front and rear.',
    '- Keep the flatbed platform and wheels visible beneath the decorative elements.',
    '- Decorate the float with theme-driven sculptural elements, foliage, props, and structural pieces — do not replace or reshape the flatbed parade-float form.',
    '- Maintain consistent proportions: a horizontal flatbed wider than it is tall, with wheels visible underneath at the front and rear.',
    '',
    'VIEWPOINT REQUIREMENTS',
    '- Render the float in a straight side elevation view.',
    '- Camera should be perpendicular to the side of the float.',
    '- No 3/4 angle.',
    '- No isometric perspective.',
    '- No dramatic perspective distortion.',
    '- No cinematic camera angles.',
    '- Create a presentation-style parade float concept rendering.',
    '',
    'DEPARTMENT SIGNAGE',
    '- Include a decorative blank sign panel on the rear-right side of the float that is integrated into the theme.',
    '- Do not render any text inside the sign panel.',
    '- No text should appear anywhere on the float.',
    '',
    'PRIDE REPRESENTATION',
    '- Express Pride through themes of belonging, visibility, authenticity, connection, community, and inclusion.',
    '- Focus on the selected environment and theme first.',
    '- Color should support the design rather than dominate it.',
    '- Rainbow imagery is optional and should never be the primary focal point unless specifically requested by the user.',
    '- Prefer environmental storytelling and symbolic design over rainbow-centric visuals.',
    '- The environment should drive the concept more than Pride color symbolism.',
    '',
    'BACKGROUND REQUIREMENTS',
    '- Render only the float concept.',
    '- No sky.',
    '- No landscape.',
    '- No street.',
    '- No crowd.',
    '- No parade environment.',
    '- No buildings behind the float.',
    '- No environmental scenery outside the float.',
    '- Preferred: transparent background.',
    '- Acceptable fallback: plain white background.',
    '- The float should appear isolated as a presentation-ready concept rendering.',
    '',
    'PRESENTATION STYLE',
    '- Create a clean concept-board style rendering.',
    '- Focus entirely on the float.',
    '- Avoid cinematic scenes.',
    '- Avoid environmental storytelling outside the float itself.',
    '- The float should be the only subject in the image.',
    '- The image should feel like a professional design presentation rather than a parade photograph.',
    '',
    'CONTENT RESTRICTIONS',
    '- No people.',
    '- No faces.',
    '- No hands.',
    '- No mascots.',
    '- No characters.',
    '- No crowds.',
    '- No logos.',
    '- No brand marks.',
    '- No sponsor graphics.',
    '- No political messaging.',
    '- No alcohol.',
    '- No drugs.',
    '- No nudity.',
    '- No overtly sexual content.',
    '',
    'GOAL',
    '',
    'The generated image should be:',
    '- A complete parade float concept.',
    '- Side-profile and structurally consistent.',
    '- Professional and workplace-appropriate.',
    '- Driven by a clear environmental theme.',
    '- Isolated on a transparent or white background.',
    '- Suitable for Creative Services review and presentation.',
  )

  return lines.join('\n')
}

export default generatePrompt
