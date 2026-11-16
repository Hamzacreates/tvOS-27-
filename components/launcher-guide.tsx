"use client"

import { useState, type FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  ExternalLink,
  House,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Star,
  RotateCcw,
  Wifi,
} from "lucide-react"
import { GuideContent } from "@/components/guide-content"

type Screen = "welcome" | "profile" | "guide" | "complete"

const steps = [
  { title: "Compatibility", detail: "Check your TV", icon: MonitorPlay },
  { title: "Developer options", detail: "Unlock the settings", icon: Sparkles },
  { title: "ADB connection", detail: "Enable debugging", icon: Wifi },
  { title: "Get the APK", detail: "Download from GitHub", icon: Download },
  { title: "Install + verify", detail: "Set Home, keep a fallback", icon: House },
]

export function LauncherGuide() {
  const [screen, setScreen] = useState<Screen>("welcome")
  const [name, setName] = useState("")
  const [draftName, setDraftName] = useState("")
  const [nameError, setNameError] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  const [tvAddress, setTvAddress] = useState("")
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [restoreOnReturn, setRestoreOnReturn] = useState(false)

  function continueToGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = draftName.trim()
    if (!cleanName) {
      setNameError("Add a name so we can personalize your setup.")
      return
    }
    setName(cleanName)
    setNameError("")
    setScreen("guide")
  }

  function updateStepCompletion(step: number, complete: boolean) {
    setCompletedSteps((current) => {
      const next = complete ? [...new Set([...current, step])] : current.filter((index) => index < step)
      return next.sort((first, second) => first - second)
    })
    if (!complete && activeStep > step) setActiveStep(step)
  }

  function startOver() {
    setScreen("welcome")
    setName("")
    setDraftName("")
    setNameError("")
    setActiveStep(0)
    setTvAddress("")
    setCompletedSteps([])
    setRestoreOnReturn(false)
  }

  const unlockedThrough = Math.min(steps.length - 1, Math.max(0, ...completedSteps.map((step) => step + 1)))

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="ambient ambient-three" aria-hidden="true" />

      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="tvOS 27 setup home" onClick={(event) => { event.preventDefault(); startOver() }}>
          <span className="brand-mark"><span /></span>
          <span className="brand-name">tvOS <b>27</b></span>
          <span className="brand-divider" />
          <span className="brand-caption">SETUP COMPANION</span>
        </a>
        <a className="repository-link" href="https://github.com/Hamzacreates/tvOS-27-" target="_blank" rel="noreferrer">
          <span>View the project</span>
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </header>

      {screen === "welcome" && (
        <section className="welcome-layout screen-enter" id="top" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR BIG SCREEN, REIMAGINED</div>
            <h1 id="welcome-title">A little more<br /><span>cinematic.</span></h1>
            <p className="welcome-description">
              Meet tvOS 27 for Android TV. Opens straight into setup—no pretend TV boot screen—then guides you through a colorful, Apple TV-inspired home while keeping every change in your hands.
            </p>
            <div className="welcome-actions">
              <button className="button button-primary button-large" onClick={() => setScreen("profile")}>
                Let&apos;s set up your TV <ArrowRight size={17} aria-hidden="true" />
              </button>
              <span className="time-note"><ShieldCheck size={15} aria-hidden="true" /> No root. Your choice, always reversible.</span>
            </div>
            <div className="welcome-proof" aria-label="Setup highlights">
              <span><Check size={14} aria-hidden="true" /> Android TV & Google TV</span>
              <i aria-hidden="true" />
              <span><Check size={14} aria-hidden="true" /> Guided, step by step</span>
              <i aria-hidden="true" />
              <span><Check size={14} aria-hidden="true" /> Reversible setup</span>
            </div>
          </div>

          <div className="preview-wrap" aria-label="tvOS 27 project screenshot">
            <div className="preview-glow" aria-hidden="true" />
            <div className="preview-frame">
              <img
                className="preview-wallpaper"
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tvOS-26-2V4EgGvHC7EMiMG7X4NVUP4FSA1W4z.jpg"
                alt="The supplied tvOS 27 GitHub repository screenshot, showing the launcher APK and project files."
              />
              <div className="preview-shade" />
              <div className="preview-image-label"><span className="live-dot" /> THE PROJECT, READY TO EXPLORE</div>
              <div className="preview-image-footer"><span>tvOS 27</span><i aria-hidden="true" /><span>ANDROID TV · GOOGLE TV</span></div>
            </div>
            <div className="floating-note floating-note-top"><span className="note-icon"><Sparkles size={15} aria-hidden="true" /></span><span><b>One smooth setup</b><small>5 guided, verified steps</small></span></div>
            <div className="floating-note floating-note-bottom"><span className="note-icon note-icon-shield"><ShieldCheck size={16} aria-hidden="true" /></span><span><b>Keep the original launcher</b><small>Switch back any time</small></span></div>
          </div>

          <div className="welcome-footer"><span>DESIGNED FOR YOUR LIVING ROOM</span><span className="footer-stroke" /><span>ANDROID TV · GOOGLE TV</span></div>
        </section>
      )}

      {screen === "profile" && (
        <section className="profile-layout screen-enter" aria-labelledby="profile-title">
          <div className="profile-orbit orbit-a" aria-hidden="true" />
          <div className="profile-orbit orbit-b" aria-hidden="true" />
          <div className="profile-card glass-card">
            <div className="profile-step-label"><span>YOUR SETUP</span><span>01 <i /> 05</span></div>
            <div className="profile-icon"><span className="profile-orb profile-orb-large">{draftName.trim().charAt(0).toUpperCase() || "✦"}</span></div>
            <div className="eyebrow eyebrow-centered"><span className="eyebrow-line" /> A MORE PERSONAL START <span className="eyebrow-line" /></div>
            <h1 id="profile-title">First, what should<br />we call <span>you?</span></h1>
            <p className="profile-description">Your name will appear in your welcome and profile preview. It stays right here in this browser session.</p>
            <form className="name-form" onSubmit={continueToGuide}>
              <label htmlFor="profile-name">Your name</label>
              <input
                id="profile-name"
                autoComplete="given-name"
                maxLength={32}
                placeholder="e.g. Alex"
                value={draftName}
                onChange={(event) => { setDraftName(event.target.value); setNameError("") }}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "name-error" : "name-hint"}
              />
              {nameError ? <p className="field-error" id="name-error">{nameError}</p> : <p className="field-hint" id="name-hint">Just a first name or nickname is perfect.</p>}
              <div className="form-actions">
                <button type="button" className="button button-quiet" onClick={() => setScreen("welcome")}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
                <button type="submit" className="button button-primary">Continue <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
            </form>
            <div className="privacy-note"><ShieldCheck size={14} aria-hidden="true" /> No account or personal details are sent anywhere.</div>
          </div>
        </section>
      )}

      {screen === "guide" && (
        <section className="guide-layout screen-enter" aria-labelledby="guide-title">
          <div className="guide-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL SETUP</div>
              <h1 id="guide-title">You&apos;re in, <span>{name}.</span></h1>
              <p>Five small steps to make your Android TV feel like home.</p>
            </div>
            <button className="button button-quiet restart-button" onClick={startOver}>Start over <ArrowRight size={15} aria-hidden="true" /></button>
          </div>

          <div className="guide-grid">
            <aside className="step-sidebar" aria-label="Setup progress">
              <div className="sidebar-progress"><span>YOUR CHECKLIST</span><span>{String(activeStep + 1).padStart(2, "0")} <i /> 05</span></div>
              <div className="progress-track" role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={5} aria-valuenow={activeStep + 1}>
                <span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
              </div>
              <nav className="step-nav" aria-label="Setup steps">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isDone = completedSteps.includes(index)
                  return (
                    <button
                      className={`step-nav-item ${index === activeStep ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
                      key={step.title}
                      onClick={() => setActiveStep(index)}
                      disabled={index > unlockedThrough}
                      aria-current={index === activeStep ? "step" : undefined}
                    >
                      <span className="step-icon">{isDone ? <Check size={16} aria-hidden="true" /> : <Icon size={16} aria-hidden="true" />}</span>
                      <span className="step-nav-copy"><b>{step.title}</b><small>{step.detail}</small></span>
                      <ChevronRight className="step-chevron" size={15} aria-hidden="true" />
                    </button>
                  )
                })}
              </nav>
              <div className="sidebar-help"><span className="help-icon"><CircleHelp size={16} aria-hidden="true" /></span><span><b>Not sure about a setting?</b><small>TV menus vary by brand. Look for a similar label.</small></span></div>
            </aside>

            <div className="guide-main">
              <GuideContent
                key={activeStep}
                step={activeStep}
                name={name}
                tvAddress={tvAddress}
                onTvAddressChange={setTvAddress}
                startOnRestore={restoreOnReturn}
                isStepComplete={completedSteps.includes(activeStep)}
                onStepCompletion={(complete) => updateStepCompletion(activeStep, complete)}
              />
              <div className="guide-pagination">
                <button className="button button-quiet" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>
                  <ArrowLeft size={16} aria-hidden="true" /> Previous
                </button>
                <span className="pagination-status">STEP {String(activeStep + 1).padStart(2, "0")} <i /> 05</span>
                {activeStep < steps.length - 1 ? (
                  <button className="button button-primary" onClick={() => setActiveStep(activeStep + 1)} disabled={!completedSteps.includes(activeStep)}>
                    Next step <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <button className="button button-primary" onClick={() => setScreen("complete")} disabled={!completedSteps.includes(activeStep)}>
                    Finish setup <Check size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="guide-bottom-note"><ShieldCheck size={14} aria-hidden="true" /> You stay in control. The stock launcher is never removed by this guide.</div>
        </section>
      )}

      {screen === "complete" && (
        <section className="finish-layout screen-enter" aria-labelledby="finish-title">
          <div className="finish-orbit finish-orbit-one" aria-hidden="true" />
          <div className="finish-orbit finish-orbit-two" aria-hidden="true" />
          <div className="finish-card glass-card">
            <div className="finish-check"><Check size={29} strokeWidth={2.4} aria-hidden="true" /></div>
            <div className="eyebrow eyebrow-centered"><span className="eyebrow-line" /> SETUP COMPLETE <span className="eyebrow-line" /></div>
            <h1 id="finish-title">You&apos;re all set,<br /><span>{name}.</span></h1>
            <p className="finish-message">Thanks for giving tvOS 27 a place in your living room. Your launcher is yours to enjoy—and your original Home app is still there if you ever want to switch back.</p>
            <div className="finish-star-card">
              <div className="finish-star-icon"><Star size={18} fill="currentColor" aria-hidden="true" /></div>
              <div><b>Help the creators keep going</b><p>If this guide helped you, please give the repository a star. It means a lot to the people behind the project.</p></div>
              <a className="finish-star-button" href="https://github.com/Hamzacreates/tvOS-27-" target="_blank" rel="noreferrer" aria-label="Open the tvOS 27 repository to give it a star">
                <Star size={15} aria-hidden="true" /><span>Star the repo</span><ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
            <div className="finish-actions">
              <button className="button button-quiet" onClick={() => { setRestoreOnReturn(true); setActiveStep(4); setScreen("guide") }}><RotateCcw size={15} aria-hidden="true" /> Keep restore steps handy</button>
              <button className="button button-primary" onClick={startOver}>Back to start <ArrowRight size={15} aria-hidden="true" /></button>
            </div>
            <div className="finish-footnote"><ShieldCheck size={14} aria-hidden="true" /> No account created. Your name stayed in this browser session.</div>
          </div>
        </section>
      )}

      <footer className="site-footer"><span>tvOS 27 · COMMUNITY PROJECT</span><span>Not affiliated with Apple, Google, or Android TV manufacturers.</span></footer>
    </main>
  )
}
