# Pride Float Studio

A single-page React + Vite app, built by **Pride at Zoro**, that
generates ChatGPT-ready prompts for Pride parade floats. ChatGPT
generates the complete float concept image directly from the prompt
— the app itself only authors the prompt and hands the user off to
ChatGPT.

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
   prompt that asks ChatGPT to design a complete parade float concept,
   copies it to the clipboard, and opens `chatgpt.com` in a new tab.
   The prompt is organized as ten sections — opener, theme-specific
   guidance (preset environment + cues *or* the custom wrapper), then
   eight uppercase headers (`TEXT RESTRICTIONS`, `FLOAT STRUCTURE`,
   `VIEWPOINT REQUIREMENTS`, `DEPARTMENT SIGNAGE`, `PRIDE
   REPRESENTATION`, `BACKGROUND REQUIREMENTS`, `PRESENTATION STYLE`,
   `CONTENT RESTRICTIONS`) — and closes with a `GOAL` summary block.
   `TEXT RESTRICTIONS` leads because text leakage (welcome signs,
   road signs, decorative typography) was the dominant failure mode
   at preview. `FLOAT STRUCTURE` describes the flatbed parade-float
   form in pure text since the workflow no longer attaches a
   template image to the chat. The `DEPARTMENT SIGNAGE` section
   instructs ChatGPT to include a decorative **blank** sign panel
   integrated into the theme — no text is rendered into the image.
   Department/team labeling, if needed, happens downstream when the
   user renames the finished image before uploading to the **Pride
   at Zoro** Google Drive folder, keeping the generated concept
   itself reusable.
3. The prompt panel surfaces a single fallback action:
   - **Copy Prompt** — clipboard only, with an inline `Copied ✓`
     flash for ~2 s. Useful if the auto-copy on Create-My-Prompt
     misses (e.g. clipboard permission denied) or if the user wants
     to re-paste later.
4. In ChatGPT: paste the prompt and hit `Enter` (or click the send
   arrow) to submit it, download the resulting float concept image,
   rename it as `Department_Pride_Float` (e.g.
   `Creative_Services_Pride_Float`) to identify your department/team
   name, and upload to the **Pride at Zoro** Google Drive folder.

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
    PromptPanel.jsx                generated prompt + Copy Prompt
  lib/
    generatePrompt.js              float-concept prompt template
  config/
    themes.js                      grouped theme catalog + per-preset
                                   environment label + visual cues
public/
  inclusion_council_logo.png       header logo
  favicon.png                      browser tab icon
  og-image.png                     1200x630 social preview image
  assets/float/                    template assets retained for
                                   internal reference; not exposed
                                   in the user workflow
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
post-generation can't desync the rendered prompt — it stays tied to
`generated`, which only updates when the user clicks **Create My
Prompt** with a valid theme.

## Accessibility

- All form inputs have explicit labels and visible focus rings.
- The `Copy Prompt` button announces status changes via
  `aria-live="polite"`.
- The header logo carries explicit alt text (`Pride at Zoro logo`).
- Reduced-motion users get animations disabled via
  `prefers-reduced-motion` (see `src/index.css`).
