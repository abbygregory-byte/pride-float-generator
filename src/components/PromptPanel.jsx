import React, { useEffect, useRef, useState } from 'react'

const FLASH_MS = 2000

export default function PromptPanel({ prompt }) {
  const [copied, setCopied] = useState(false)
  const copyFlashTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (copyFlashTimer.current) clearTimeout(copyFlashTimer.current)
    }
  }, [])

  // Whenever the prompt itself changes (re-generation), drop any stale
  // copy flash so the UI doesn't lie about state that's tied to the
  // previous prompt.
  useEffect(() => {
    setCopied(false)
    if (copyFlashTimer.current) {
      clearTimeout(copyFlashTimer.current)
      copyFlashTimer.current = null
    }
  }, [prompt])

  const flashCopy = () => {
    setCopied(true)
    if (copyFlashTimer.current) clearTimeout(copyFlashTimer.current)
    copyFlashTimer.current = setTimeout(() => setCopied(false), FLASH_MS)
  }

  const handleCopy = async () => {
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(prompt)
      flashCopy()
    } catch {
      // Clipboard API can fail on insecure origins / older browsers — fall
      // back to selecting the textarea so the user can copy manually.
      const ta = document.getElementById('prompt-output')
      if (ta && typeof ta.select === 'function') ta.select()
    }
  }

  const isReady = !!prompt

  return (
    <section
      className="surface-card relative overflow-hidden p-5 sm:p-6"
      aria-labelledby="prompt-panel-title"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: '#0B485B' }}
      />
      <header className="mb-3">
        <h2
          id="prompt-panel-title"
          className="text-lg font-medium text-slate-900 tracking-tight"
        >
          Your Prompt
        </h2>
      </header>

      {!isReady ? (
        <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-brand-plum-soft/60 px-6 text-center">
          <EmptyStateIcon />
          <p className="mt-2 text-sm font-medium text-slate-700">
            Your generated ChatGPT prompt will appear here.
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            Choose a theme to get started.
          </p>
        </div>
      ) : (
        <>
          <textarea
            id="prompt-output"
            readOnly
            value={prompt}
            spellCheck={false}
            aria-label="Generated prompt"
            className="block w-full resize-none overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            style={{ maxHeight: '360px', height: '360px' }}
          />

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleCopy}
              aria-live="polite"
              className="text-center text-sm text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
            >
              {copied ? 'Copied ✓' : 'Copy Prompt'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function EmptyStateIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-brand-plum"
    >
      <path
        d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z"
        fill="currentColor"
      />
      <path
        d="M19 14l.9 2.3 2.3.9-2.3.9L19 20.5l-.9-2.4-2.3-.9 2.3-.9L19 14z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  )
}
