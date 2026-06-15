import React, { useState } from 'react'
import { THEME_GROUPS, findThemeById } from '../config/themes.js'

// Custom-theme example seeds. Display-only — the list is illustrative,
// not a picker. Lives here (not in `themes.js`) because these are UI
// affordances, not catalog data. The textarea remains free-form.
// Each entry pairs a scannable title with a short descriptive detail
// rendered after an em-dash.
const CUSTOM_THEME_EXAMPLES = [
  {
    title: 'Pride at the Pier',
    detail:
      'a festive waterfront boardwalk with decorative sails, pavilions, string lights, and gathering spaces',
  },
  {
    title: 'Festival of Lights',
    detail:
      'illuminated lanterns, glowing pathways, celestial arches, beacon towers, and evening celebration',
  },
  {
    title: 'Under One Sky',
    detail:
      'constellations, stars, moons, lanterns, and shared wonder beneath a celestial sky',
  },
  {
    title: 'A Place for Everyone',
    detail:
      'welcoming gateways, public art, mosaics, gathering spaces, and a vibrant civic plaza',
  },
  {
    title: 'The Ties That Connect Us',
    detail:
      'woven structures, braided pathways, interconnected arches, and symbolic community connections',
  },
]

// Float-form state lives entirely inside this component. On submit
// the form emits a single payload object —
// `{ theme, environment, cues, isCustom }` — that the parent stores
// in its Generate-time snapshot.
//
// Custom themes are gated by a checkbox in a visually distinct
// section below the curated dropdown. While the checkbox is on, the
// curated <select> above is disabled and the textarea takes over.

export default function FloatForm({ onSubmit }) {
  const [selectedThemeId, setSelectedThemeId] = useState('')
  const [useCustomTheme, setUseCustomTheme] = useState(false)
  const [customThemeText, setCustomThemeText] = useState('')

  const canSubmit = useCustomTheme
    ? customThemeText.trim().length > 0
    : selectedThemeId.length > 0 && findThemeById(selectedThemeId) !== null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    if (useCustomTheme) {
      onSubmit({
        theme: customThemeText.trim(),
        environment: null,
        cues: null,
        isCustom: true,
      })
    } else {
      const preset = findThemeById(selectedThemeId)
      onSubmit({
        theme: preset.label,
        environment: preset.environment,
        cues: preset.cues,
        isCustom: false,
      })
    }
  }

  const selectDisabled = useCustomTheme

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-card relative overflow-hidden p-5 sm:p-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: '#0B485B' }}
      />
      <div className="mb-5">
        <h2 className="text-lg font-medium text-slate-900 tracking-tight">
          Design Your Float
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="theme" className="field-label">
            Float Theme
            <RequiredMark />
          </label>
          <select
            id="theme"
            required={!useCustomTheme}
            disabled={selectDisabled}
            aria-disabled={selectDisabled}
            className={`field-select ${
              selectDisabled ? 'cursor-not-allowed opacity-60' : ''
            }`}
            value={selectedThemeId}
            onChange={(e) => setSelectedThemeId(e.target.value)}
          >
            <option value="" disabled>
              Select a theme…
            </option>
            {THEME_GROUPS.map((group) => (
              <optgroup key={group.id} label={group.label}>
                {group.themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="mb-3 font-display text-base font-semibold text-slate-900">
          Or Create Your Own Theme
        </h3>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal"
            checked={useCustomTheme}
            onChange={(e) => setUseCustomTheme(e.target.checked)}
          />
          <span className="font-medium">Use Custom Theme</span>
        </label>

        {useCustomTheme && (
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="customTheme" className="field-label">
                Custom Theme
                <RequiredMark />
              </label>
              <p className="mt-1 mb-2 text-xs text-slate-500">
                {`Describe the environment, scenery, structures, props, colors, and atmosphere you want the float to be inspired by. The more visual detail you provide, the stronger the concept will be.`}
              </p>
              <textarea
                id="customTheme"
                required
                rows={5}
                placeholder="Describe the visual world you want for the float — colors, symbols, scenery, props, mood, or any specific idea."
                className="field-textarea"
                value={customThemeText}
                onChange={(e) => setCustomThemeText(e.target.value)}
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">
                Examples
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500">
                {CUSTOM_THEME_EXAMPLES.map((ex) => (
                  <li
                    key={ex.title}
                    className="flex items-baseline gap-2"
                  >
                    <span aria-hidden="true" className="text-brand-plum">
                      •
                    </span>
                    <span className="leading-snug">
                      <span className="font-medium text-slate-700">
                        {ex.title}
                      </span>
                      <span className="text-slate-500"> — {ex.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-brand-teal px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative flex items-center gap-2">
          <Sparkle />
          Create My Prompt
        </span>
      </button>
    </form>
  )
}

function RequiredMark() {
  return (
    <span
      className="ml-0.5 text-rose-500"
      aria-hidden="true"
      title="Required"
    >
      *
    </span>
  )
}

function Sparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z"
        fill="currentColor"
      />
      <path
        d="M19 14l.9 2.3 2.3.9-2.3.9L19 20.5l-.9-2.4-2.3-.9 2.3-.9L19 14z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}
