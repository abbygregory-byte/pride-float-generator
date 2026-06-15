# Pride Float Studio

A single-page React + Vite app, built by **Pride at Zoro**, that
generates ChatGPT-ready prompts and reference packs for Pride parade
floats. ChatGPT generates the complete float concept image directly,
using the attached float template as the structural base. The app
itself only authors the prompt and ships the reference pack — it does
not post-process ChatGPT's output.

No AI APIs, no backend, no fetch except for static assets under
`public/` and the external link to `chatgpt.com`. Styled with Tailwind
CSS, typeset in Geist with Arial fallback.

## How it works

1. Pick a **Theme** in the left-hand form. The Theme field is a
   curated picker grouped into three families — **Growth & Belonging**,
   **Light & Visibility**, **Connection & Community** — covering 6
   presets total. Each curated preset contributes both a structural
   **environment** label (e.g. *Botanical Garden*, *Lantern Festival*,
   *Mosaic Plaza*) and a **visual cues** array (concrete imagery
   anchors like *floral arches*, *floating lanterns*, *stained glass
   structures*). The generator renders these as two adjacent sentences
   in the prompt:
   `Set this float in a {environment} environment.` /
   `Visual cues: {cue1, cue2, …}.`
   Below the curated dropdown, a separate **Or Create Your Own
   Theme** section offers a checkbox toggle that swaps the dropdown
   for a tall free-form textarea (with a few example seeds shown
   beneath). Custom themes get a wrapper paragraph instead of the
   environment + cues sentences, keeping vague ideas on-brief.
2. Click **Create My Prompt** → the app composes a ChatGPT-ready
   prompt that asks ChatGPT to design a complete parade float concept
   using the attached template as the structural base. The prompt is
   organized as nine sections — opener, theme-specific guidance
   (preset environment + cues *or* the custom wrapper), then seven
   uppercase headers (`TEMPLATE PRESERVATION`, `VIEWPOINT
   REQUIREMENTS`, `DEPARTMENT SIGNAGE`, `PRIDE REPRESENTATION`,
   `BACKGROUND REQUIREMENTS`, `PRESENTATION STYLE`, `CONTENT
   RESTRICTIONS`) — and closes with a `GOAL` summary block. The
   `DEPARTMENT SIGNAGE` section instructs ChatGPT to include a
   decorative **blank** sign panel integrated into the theme — no
   text is rendered into the image. Team or department labeling, if
   needed, happens downstream when the user renames the finished
   image before uploading to Creative Services, keeping the generated
   concept itself reusable.
3. Use one of three actions on the prompt panel:
   - **Create My Prompt** *(primary, in the form)* — opens
     `chatgpt.com` in a new tab, copies the prompt to the clipboard,
     and downloads the input pack ZIP in a single click.
   - **Copy Prompt** *(secondary)* — clipboard only, with an inline
     `Copied ✓` flash for ~2 s.
   - **Download ZIP File** *(secondary)* — ZIP only, with an inline
     `Downloaded ✓` (or `Download failed — try again` in rose) flash
     for ~2 s.
4. In ChatGPT: upload the two reference PNGs, paste the prompt,
   generate the float concept image, download the result, rename it
   to identify your team (e.g. `creative-services-let-love-grow.png`),
   and upload to the Creative Services Google Drive folder.

## Input pack contents

The downloaded ZIP is named `pride-float-input-pack-{themeSlug}.zip`
and contains four files:

| File                              | Role                                                              |
| --------------------------------- | ----------------------------------------------------------------- |
| `prompt.txt`                      | The generated brief, ready to paste into ChatGPT.                 |
| `instructions.txt`                | Bundled how-to that walks through the in-ChatGPT next steps.      |
| `float_template_with_wheels.png`  | Float template with wheels — the structural reference for ChatGPT.|
| `float_style_reference.png`       | Style guidance for tone, color, and decorative vocabulary.        |

## Run it locally

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` (or the next free port).
There are no Netlify Functions in this project, so the **Netlify CLI is
not required** for local development.

## Build for production

```bash
npm run build
npm run preview
```

`netlify.toml` configures the build output (`dist`) for when this is
deployed to Netlify, but no serverless functions are involved.

## Project layout

```
src/
  App.jsx                          page shell + form/panel layout
  main.jsx                         React entry
  index.css                        Tailwind layers + component classes
  components/
    FloatForm.jsx                  theme form + Create My Prompt
    PromptPanel.jsx                generated prompt + 2 action buttons
  lib/
    generatePrompt.js              float-concept prompt template
    buildInputPack.js              ZIP builder (prompt + instructions
                                   + 2 reference PNGs)
    inputPackInstructions.js       text bundled into instructions.txt
    slugify.js                     URL/filename slug helpers
  config/
    floatAssets.js                 asset-path documentation (kept as
                                   a stable record; live paths are
                                   inlined in buildInputPack.js)
    themes.js                      grouped theme catalog + per-preset
                                   environment label + visual cues
public/
  inclusion_council_logo.png       header logo
  favicon.png                      browser tab icon
  assets/float/
    float_template_with_wheels.png shipped in the ZIP
    float_style_reference.png      shipped in the ZIP
    float_template_generation.png  dormant; kept on disk
    float_design_zone_mask.png     dormant; kept on disk
    float_wheel_overlay.png        dormant; kept on disk
    rear_right_sign_zone_mask.png  dormant; kept on disk
netlify.toml                       Netlify build config (no functions)
vite.config.js                     plain Vite + react()
```

## App-level state

`App.jsx` is intentionally tiny. One piece of state:

```
generated:  null | { theme, environment, cues, isCustom }   Generate-time snapshot
```

`FloatForm` owns its own form bindings internally and emits a single
payload via `onSubmit`. The prompt is derived via
`useMemo(() => generatePrompt(generated), …)` so editing the form
post-generation can't desync the prompt or the slugified ZIP
filename — both stay tied to `generated`, which only updates when the
user clicks **Create My Prompt** with a valid theme.

## Accessibility

- All form inputs have explicit labels and visible focus rings.
- The `Copy Prompt` and `Download Input Pack` buttons announce status
  changes via `aria-live="polite"`.
- The header logo carries explicit alt text (`Pride at Zoro logo`).
- Reduced-motion users get animations disabled via
  `prefers-reduced-motion` (see `src/index.css`).
