import React, { useMemo, useState } from 'react'
import FloatForm from './components/FloatForm.jsx'
import PromptPanel from './components/PromptPanel.jsx'
import { generatePrompt } from './lib/generatePrompt.js'

// External destinations the workflow hands users off to. Centralized
// here so the WorkflowBanner Submit-step link and the auto-open
// behavior on Create-My-Prompt reference the same source of truth.
const CHATGPT_URL = 'https://chatgpt.com/'
const GOOGLE_DRIVE_URL =
  'https://drive.google.com/drive/folders/1UmqZYJKohutPSlK_EjSsok0yq69rp4V4'

// Brand teal used for the section ribbons under the WorkflowBanner,
// the two main-row cards, and the WorkflowBanner step number badges.
// The rainbow gradient is reserved for the header strip at the very
// top of the dashboard.
const RIBBON_TEAL = '#0B485B'

export default function App() {
  // Snapshot of the form payload the user committed to via Create
  // My Prompt — `{ theme, environment, cues, isCustom }`. Decoupled
  // from FloatForm's live state so editing the form post-generation
  // can't desync the rendered prompt. The FloatForm owns its own form
  // state internally and emits this payload via `onSubmit`.
  const [generated, setGenerated] = useState(null)

  const prompt = useMemo(
    () => (generated ? generatePrompt(generated) : null),
    [generated],
  )

  const handleGenerate = (payload) => {
    if (!payload?.theme) return
    const next = {
      theme: payload.theme,
      environment: payload.environment ?? null,
      cues: Array.isArray(payload.cues) ? payload.cues : null,
      isCustom: !!payload.isCustom,
    }
    const promptText = generatePrompt(next)
    if (!promptText) return

    // Open ChatGPT FIRST, synchronously, while we're still inside the
    // user-gesture stack. Doing async work (clipboard write) before
    // this call would let popup blockers cancel the new tab.
    try {
      window.open(CHATGPT_URL, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.warn('Failed to open ChatGPT', err)
    }

    setGenerated(next)

    // Copy the prompt to the clipboard so the user can paste it into
    // ChatGPT in one motion. Failures are logged silently; the prompt
    // panel's Copy Prompt button is the manual fallback.
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(promptText).catch((err) => {
        console.warn('Clipboard write failed', err)
      })
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <WorkflowBanner />

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-6">
          <FloatForm onSubmit={handleGenerate} />
          <PromptPanel prompt={prompt} />
        </div>
      </main>
    </div>
  )
}

// Full-width horizontal step row at the top of the page. The detailed
// explainer for the workflow — readable left-to-right on desktop,
// stacked on mobile. The Submit step carries the Google Drive folder
// link so the closing action is visible at a glance.
function WorkflowBanner() {
  return (
    <section
      aria-labelledby="workflow-title"
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: RIBBON_TEAL }}
      />
      <h2
        id="workflow-title"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
      >
        How It Works
      </h2>
      <ol className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-7">
        <WorkflowStep
          number={1}
          title="Design Your Float"
          bullets={[
            'Choose a curated theme or create your own',
            <>
              Click{' '}
              <strong className="font-semibold text-slate-900">
                Create My Prompt
              </strong>
            </>,
          ]}
        />
        <WorkflowStep
          number={2}
          title="Create in ChatGPT"
          bullets={[
            'Open ChatGPT',
            'Paste the copied prompt',
            'Generate your float concept',
            'Download the completed image',
          ]}
        />
        <WorkflowStep
          number={3}
          title="Submit"
          bullets={[
            <>
              Rename the downloaded file as{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">
                department_pridefloat
              </code>{' '}
              to clearly identify your department/team name
              <br />
              <span className="text-xs text-slate-500">
                e.g. creative services_pridefloat
              </span>
            </>,
            'Upload the image to the Pride at Zoro Google Drive folder',
          ]}
          note={
            <>
              <strong className="font-semibold text-slate-800">Note:</strong>{' '}
              Any blank signage included in the float concept is intentional.
              Creative Services will add the department/team name during
              final production to ensure accuracy and consistency.
            </>
          }
          action={{
            href: GOOGLE_DRIVE_URL,
            label: 'Open Google Drive Folder',
          }}
        />
      </ol>
    </section>
  )
}

function WorkflowStep({ number, title, bullets, note, action }) {
  return (
    <li className="flex flex-col">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm shadow-slate-900/10"
          style={{ backgroundColor: RIBBON_TEAL }}
          aria-hidden="true"
        >
          {number}
        </span>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="mt-2 ml-5 list-disc space-y-1 text-sm leading-relaxed text-slate-600 marker:text-slate-300">
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full border bg-white px-3.5 py-1.5 text-xs font-semibold transition hover:bg-slate-50"
          style={{ borderColor: RIBBON_TEAL, color: RIBBON_TEAL }}
        >
          {action.label}
          <ExternalLinkIcon />
        </a>
      )}
      {note && (
        <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
          {note}
        </p>
      )}
    </li>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 4h6v6M20 4l-9 9M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Header() {
  return (
    <header className="relative">
      <div className="bg-pride-gradient h-1 w-full" aria-hidden="true" />
      <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-3 font-display text-xl font-medium leading-tight text-slate-900 sm:text-2xl lg:text-3xl">
              Pride Float Prompt Generator
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <img
      src="/inclusion_council_logo.png"
      alt="Pride at Zoro logo"
      className="h-20 w-auto flex-shrink-0 object-contain sm:h-28"
    />
  )
}
