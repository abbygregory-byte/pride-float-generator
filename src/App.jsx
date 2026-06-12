import React, { useMemo, useState } from 'react'
import FloatForm from './components/FloatForm.jsx'
import PromptPanel from './components/PromptPanel.jsx'
import { generatePrompt } from './lib/generatePrompt.js'
import buildInputPack from './lib/buildInputPack.js'

export default function App() {
  // Snapshot of the form payload the user committed to via Generate
  // Prompt — `{ teamName, theme, environment, cues, isCustom }`.
  // Decoupled from FloatForm's live state so editing the form
  // post-generation can't desync the rendered prompt or the slugified
  // ZIP filename. The FloatForm owns its own form state internally
  // and emits this payload via `onSubmit`.
  const [generated, setGenerated] = useState(null)

  const prompt = useMemo(
    () => (generated ? generatePrompt(generated) : null),
    [generated],
  )

  const handleGenerate = (payload) => {
    if (!payload?.teamName || !payload?.theme) return
    const next = {
      teamName: payload.teamName,
      theme: payload.theme,
      environment: payload.environment ?? null,
      cues: Array.isArray(payload.cues) ? payload.cues : null,
      isCustom: !!payload.isCustom,
    }
    const promptText = generatePrompt(next)
    if (!promptText) return
    setGenerated(next)

    // Fire-and-forget the two side effects users expect from a single
    // Generate Prompt click: clipboard write + ZIP download. Failures
    // are logged silently; the prompt panel's secondary buttons exist
    // as manual fallbacks.
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(promptText).catch((err) => {
        console.warn('Clipboard write failed', err)
      })
    }

    buildInputPack({
      prompt: promptText,
      teamName: next.teamName,
      theme: next.theme,
    })
      .then(({ blob, filename }) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      })
      .catch((err) => console.warn('ZIP download failed', err))
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <p className="mb-6 text-base text-slate-700">
          Design a Pride float concept for your team using curated
          themes and AI-powered creative direction.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* 40% — steps card stacked above the input form */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6">
              <StepsCard />
              <FloatForm onSubmit={handleGenerate} />
            </div>
          </div>

          {/* 60% — prompt workspace */}
          <div className="lg:col-span-3">
            <PromptPanel
              prompt={prompt}
              teamName={generated?.teamName ?? ''}
              theme={generated?.theme ?? ''}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function StepsCard() {
  return (
    <section
      aria-labelledby="steps-card-title"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="steps-card-title"
        className="text-lg font-medium text-slate-900 tracking-tight"
      >
        How It Works
      </h2>

      <div className="mt-4 space-y-5">
        <StepSection number="1" title="Design Your Float">
          <li>Enter your department or team name.</li>
          <li>Choose a curated theme or create your own.</li>
          <li>
            Click <strong className="font-semibold">Generate Prompt</strong>.
          </li>
        </StepSection>

        <StepSection number="2" title="Create Your Concept in ChatGPT">
          <li>A prompt will be copied to your clipboard.</li>
          <li>
            A ZIP file containing the float templates will download
            automatically.
          </li>
          <li>Open ChatGPT.</li>
          <li>Upload the downloaded ZIP file.</li>
          <li>Paste the copied prompt.</li>
          <li>Generate your float concept.</li>
        </StepSection>

        <StepSection number="3" title="Submit Your Concept">
          <li>Download your completed float concept from ChatGPT.</li>
          <li>Send the image to Sarah Laue and Abby Gregory in Slack.</li>
          <li>Include your department or team name with your submission.</li>
        </StepSection>
      </div>
    </section>
  )
}

function StepSection({ number, title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">
        <span className="text-slate-400">{number}.</span> {title}
      </h3>
      <ul className="mt-1.5 ml-5 list-disc space-y-1 text-sm text-slate-700 marker:text-slate-300">
        {children}
      </ul>
    </div>
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
            <h1 className="mt-3 font-display text-lg font-medium leading-tight text-slate-900 sm:text-xl lg:text-2xl">
              Pride Float Generator
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
