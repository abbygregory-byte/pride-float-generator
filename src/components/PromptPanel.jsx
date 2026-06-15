import React, { useEffect, useRef, useState } from 'react'
import buildInputPack from '../lib/buildInputPack.js'

const FLASH_MS = 2000

export default function PromptPanel({ prompt, theme = '' }) {
  const [copied, setCopied] = useState(false)
  // Standalone-download-button state. 'idle' is the resting label;
  // 'success' / 'error' flash for FLASH_MS then reset to 'idle'.
  const [downloadStatus, setDownloadStatus] = useState('idle')
  const [isDownloading, setIsDownloading] = useState(false)

  const copyFlashTimer = useRef(null)
  const downloadFlashTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (copyFlashTimer.current) clearTimeout(copyFlashTimer.current)
      if (downloadFlashTimer.current) clearTimeout(downloadFlashTimer.current)
    }
  }, [])

  // Whenever the prompt itself changes (re-generation), drop any stale
  // success / error flashes so the UI doesn't lie about state that's
  // tied to the previous prompt.
  useEffect(() => {
    setCopied(false)
    setDownloadStatus('idle')
    if (copyFlashTimer.current) {
      clearTimeout(copyFlashTimer.current)
      copyFlashTimer.current = null
    }
    if (downloadFlashTimer.current) {
      clearTimeout(downloadFlashTimer.current)
      downloadFlashTimer.current = null
    }
  }, [prompt])

  const flashCopy = () => {
    setCopied(true)
    if (copyFlashTimer.current) clearTimeout(copyFlashTimer.current)
    copyFlashTimer.current = setTimeout(() => setCopied(false), FLASH_MS)
  }

  const flashDownload = (status) => {
    setDownloadStatus(status)
    if (downloadFlashTimer.current) clearTimeout(downloadFlashTimer.current)
    downloadFlashTimer.current = setTimeout(
      () => setDownloadStatus('idle'),
      FLASH_MS,
    )
  }

  // Wire a built ZIP into a synthetic download anchor click. Defers
  // revoking the object URL by 1 s so the browser has time to start
  // the download before we drop the blob.
  const triggerZipDownload = ({ blob, filename }) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
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

  // Standalone fallback download — most users never need this since the
  // primary Generate Prompt click already triggers the ZIP download via
  // App.jsx. Surfaces an inline ✓ / error flash, mirrors the Copy Prompt
  // pattern.
  const handleDownloadInputPack = async () => {
    if (!prompt || isDownloading) return
    setIsDownloading(true)
    try {
      const result = await buildInputPack({ prompt, theme })
      triggerZipDownload(result)
      flashDownload('success')
    } catch {
      flashDownload('error')
    } finally {
      setIsDownloading(false)
    }
  }

  const isReady = !!prompt

  // Resolve the secondary Download button label + tone from its current
  // status. Error state flashes rose; success state flashes default
  // slate. Disabled while a download is in-flight.
  const downloadLabel = (() => {
    if (downloadStatus === 'success') return 'Downloaded ✓'
    if (downloadStatus === 'error') return 'Download failed — try again'
    if (isDownloading) return 'Downloading…'
    return 'Download ZIP File'
  })()
  const downloadToneClass =
    downloadStatus === 'error'
      ? 'text-rose-600 hover:text-rose-700'
      : 'text-slate-600 hover:text-slate-900'

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

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopy}
              aria-live="polite"
              className="text-center text-sm text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
            >
              {copied ? 'Copied ✓' : 'Copy Prompt'}
            </button>

            <button
              type="button"
              onClick={handleDownloadInputPack}
              disabled={isDownloading}
              aria-live="polite"
              className={`text-center text-sm underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:opacity-60 ${downloadToneClass}`}
            >
              {downloadLabel}
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
