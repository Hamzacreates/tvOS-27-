"use client"

import { useState, type ReactNode } from "react"
import {
  Check,
  ChevronDown,
  CircleAlert,
  Clipboard,
  Download,
  House,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react"

const rawApkUrl = "https://raw.githubusercontent.com/Hamzacreates/tvOS-27-/main/tvOS%2027%20stable.apk"

type Props = {
  step: number
  name: string
  tvAddress: string
  onTvAddressChange: (address: string) => void
  startOnRestore: boolean
  isStepComplete: boolean
  onStepCompletion: (complete: boolean) => void
}

type Assistant = "Google Antigravity" | "Claude Code"
type PromptMode = "install" | "restore"

export function GuideContent({ step, name, tvAddress, onTvAddressChange, startOnRestore, isStepComplete, onStepCompletion }: Props) {
  const [assistant, setAssistant] = useState<Assistant>("Google Antigravity")
  const [promptMode, setPromptMode] = useState<PromptMode>(startOnRestore ? "restore" : "install")
  const [copyState, setCopyState] = useState("Copy prompt")

  const target = tvAddress.trim() || "[TV_IP:PORT_FROM_YOUR_TV]"
  const installPrompt = `I’m using ${assistant} to set up the tvOS 27 launcher on my own Android TV / Google TV. My TV’s ADB address is ${target}. My name is ${name}.

Please guide me one step at a time and only work with that TV on my local network.

1. Check whether Android Platform Tools (adb) are installed. If not, show me how to get them from the official Android developer site and wait for me to finish.
2. Find the downloaded file named “tvOS 27 stable.apk” in my Downloads folder (or ask me to choose it). Inspect its manifest to identify the package name and HOME/launcher activity; do not guess either value.
3. Connect only to ${target}. Use the exact address and port shown by the TV’s Wireless debugging / network debugging screen. If it asks for a pairing code or an approval on the TV, stop and tell me what to approve. Never scan the network or try other devices or ports.
4. Confirm the connected device with adb devices -l. Before changing anything, identify and record the TV’s current default Home activity so we can restore it.
5. Install the APK with adb install -r using the exact file path. Verify the install succeeded.
6. Before changing the Home app, show me the exact launcher component and ask me to confirm. If I approve and the TV supports it, use adb shell cmd package set-home-activity <package>/<activity>. Otherwise, guide me through Settings > Apps > Default apps > Home app. Do not root the TV, disable or uninstall its stock launcher, bypass security checks, or change unrelated settings.
7. Give me the exact restore steps using the original Home activity you recorded. Do not claim a step succeeded unless its output confirms it.`

  const restorePrompt = `I want to switch my own Android TV / Google TV back to its original Home launcher. Its ADB address is ${target}.

Please guide me carefully:
1. Connect only to ${target}, using the exact address and port shown in the TV’s Wireless debugging / network debugging screen. If the TV asks for approval, stop and ask me to approve it. Do not scan for other devices.
2. Use the original Home package/activity recorded before tvOS 27 was selected. If it was not recorded, help me find the stock launcher in Settings > Apps > Default apps > Home app and ask me to choose it; do not guess.
3. Restore the original Home app using Android’s supported settings. If adb shell cmd package set-home-activity is supported, show me the exact command with the recorded original package/activity before running it and ask me to confirm.
4. Verify that the TV returns to its original home screen. Do not uninstall or disable any app unless I explicitly ask.`

  const prompt = promptMode === "install" ? installPrompt : restorePrompt

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyState("Copied")
      window.setTimeout(() => setCopyState("Copy prompt"), 1800)
    } catch {
      setCopyState("Select the text to copy")
    }
  }

  if (step === 0) {
    return (
      <article className="content-card step-enter" aria-labelledby="step-title">
        <StepHeader number="01" label="BEFORE YOU BEGIN" title="Let’s make sure your TV is ready." description="This setup is designed for Android TV and Google TV devices, not every smart TV." icon={<ShieldCheck size={18} aria-hidden="true" />} />
        <div className="compatibility-callout">
          <span className="callout-icon"><CircleAlert size={19} aria-hidden="true" /></span>
          <div><b>Android TV or Google TV required</b><p>Samsung TVs (Tizen), LG TVs (webOS), Roku TVs, and other non-Android platforms aren’t compatible with this APK.</p></div>
        </div>
        <div className="readiness-grid">
          <div className="readiness-item"><span className="readiness-number">01</span><b>Your TV runs Android TV or Google TV</b><small>Check Settings → About if you’re unsure.</small></div>
          <div className="readiness-item"><span className="readiness-number">02</span><b>You have access to its settings</b><small>You’ll turn on Developer options yourself.</small></div>
          <div className="readiness-item"><span className="readiness-number">03</span><b>You can approve prompts on screen</b><small>Keep the remote nearby during setup.</small></div>
        </div>
        <label className={`confirm-row ${isStepComplete ? "is-checked" : ""}`}>
          <input type="checkbox" checked={isStepComplete} onChange={(event) => onStepCompletion(event.target.checked)} />
          <span className="custom-check"><Check size={13} aria-hidden="true" /></span>
          <span><b>I have an Android TV or Google TV</b><small>I understand this guide won’t work on a standard non-Android smart TV.</small></span>
        </label>
        <div className="inline-note"><Info size={15} aria-hidden="true" /><span>Changing the default Home app can vary by manufacturer. This guide always keeps a route back to your original launcher.</span></div>
      </article>
    )
  }

  if (step === 1) {
    return (
      <article className="content-card step-enter" aria-labelledby="step-title">
        <StepHeader number="02" label="ON YOUR TV" title="Unlock Developer options." description="Android hides these tools until you enable them from the About screen." icon={<Sparkles size={18} aria-hidden="true" />} />
        <div className="instruction-list">
          <Instruction number="1" title="Open Settings" text="Use your TV remote to open the Settings app." />
          <Instruction number="2" title="Find About" text="Look under Device Preferences → About, or System → About. Names vary a little by TV brand." />
          <Instruction number="3" title="Tap the build number seven times" text="Select Build, Build number, or Android TV OS build repeatedly until you see “You are now a developer.” Enter your TV PIN if requested." />
          <Instruction number="4" title="Return to Settings" text="Developer options should now appear under Device Preferences or System." />
        </div>
        <div className="inline-note"><Info size={15} aria-hidden="true" /><span>On some TVs the item is called “Android TV OS build.” If you don’t see it, check the manufacturer’s support guide for your exact model.</span></div>
        <StepCompletion isComplete={isStepComplete} onChange={onStepCompletion} label="Developer options are now visible on my TV." detail="You can come back to this step if the menu label is different." />
      </article>
    )
  }

  if (step === 2) {
    return (
      <article className="content-card step-enter" aria-labelledby="step-title">
        <StepHeader number="03" label="ON YOUR TV" title="Enable debugging." description="Keep your TV and computer on the same trusted home network." icon={<Wifi size={18} aria-hidden="true" />} />
        <div className="debug-layout">
          <div className="instruction-list compact-list">
            <Instruction number="1" title="Open Developer options" text="Settings → Device Preferences (or System) → Developer options." />
            <Instruction number="2" title="Turn on network debugging" text="Enable Wireless debugging or Network debugging if your TV offers it." />
            <Instruction number="3" title="Approve your computer" text="Accept the on-screen prompt only for a computer you recognize." />
          </div>
          <div className="network-card">
            <div className="network-card-top"><span className="network-icon"><Wifi size={16} aria-hidden="true" /></span><span className="network-status">LOCAL NETWORK</span></div>
            <b>Find your TV&apos;s address</b>
            <p>Open Settings → Network & Internet → your connected network. Look for IP address or Wireless debugging.</p>
            <div className="network-example"><span>Example address</span><code>192.168.1.42:5555</code></div>
          </div>
        </div>
        <div className="security-note"><ShieldCheck size={16} aria-hidden="true" /><span>Use the exact IP and port shown by your TV. The example above is only a format—not an address to copy.</span></div>
        <details className="troubleshooting"><summary>Wireless debugging isn’t available?</summary><div className="troubleshooting-content"><p>Some TVs only expose ADB over USB or use a separate “Network debugging” switch. Check your TV maker’s support page for your model; don’t guess a port or connect to a device you don’t recognize.</p><p>After a reboot, the TV may show a new address or port. Use the current value displayed on the TV.</p></div></details>
        <StepCompletion isComplete={isStepComplete} onChange={onStepCompletion} label="Debugging is enabled and I found the current TV address." detail="Only approve a computer you own and recognize." />
      </article>
    )
  }

  if (step === 3) {
    return (
      <article className="content-card step-enter" aria-labelledby="step-title">
        <StepHeader number="04" label="THE APP FILE" title="Download tvOS 27." description="Save the APK to Downloads, then continue when you’re ready." icon={<Download size={18} aria-hidden="true" />} />
        <div className="apk-download-card">
          <span className="apk-download-icon"><Download size={20} aria-hidden="true" /></span>
          <span className="apk-download-copy"><b>tvOS 27 stable.apk</b><small>Direct file · Android package</small></span>
          <span className="apk-download-ready"><ShieldCheck size={14} aria-hidden="true" /> Ready</span>
        </div>
        <a className="button button-primary download-button" href={rawApkUrl} download="tvOS 27 stable.apk"><Download size={18} aria-hidden="true" /> Download APK</a>
        <div className="download-note"><Info size={16} aria-hidden="true" /><span>Android may ask you to confirm installing this app. Only install files you trust.</span></div>
        <StepCompletion isComplete={isStepComplete} onChange={onStepCompletion} label="The APK is in my Downloads folder." detail="Keep the file until you’ve confirmed the install." />
      </article>
    )
  }

  return (
    <article className="content-card step-enter" aria-labelledby="step-title">
        <StepHeader number="05" label="THE FINAL STEP" title="Install, then choose Home." description="A trusted assistant can guide setup on your computer. You approve every change." icon={<House size={18} aria-hidden="true" />} />
      <div className="assistant-label">PICK THE ASSISTANT YOU HAVE ACCESS TO</div>
      <div className="assistant-options" role="group" aria-label="Choose a coding assistant">
        <button type="button" className={`assistant-option ${assistant === "Google Antigravity" ? "is-selected" : ""}`} onClick={() => setAssistant("Google Antigravity")} aria-pressed={assistant === "Google Antigravity"}>
          <span className="assistant-radio" />
          <span className="assistant-copy"><b>Google Antigravity</b><small>Recommended if you don&apos;t have Claude premium</small></span>
          <span className="assistant-badge">GOOD TO START</span>
        </button>
        <button type="button" className={`assistant-option ${assistant === "Claude Code" ? "is-selected" : ""}`} onClick={() => setAssistant("Claude Code")} aria-pressed={assistant === "Claude Code"}>
          <span className="assistant-radio" />
          <span className="assistant-copy"><b>Claude Code</b><small>Best if you already have a paid Claude plan</small></span>
          <span className="assistant-badge assistant-badge-muted">PAID PLAN</span>
        </button>
      </div>

      <label className="address-label" htmlFor="tv-address">Your TV&apos;s IP address <span>Optional for now</span></label>
      <div className="address-field"><Wifi size={17} aria-hidden="true" /><input id="tv-address" type="text" inputMode="decimal" autoComplete="off" placeholder="192.168.1.42:5555 or the address shown on TV" value={tvAddress} onChange={(event) => onTvAddressChange(event.target.value)} /><span className="address-lock" title="This page does not send the address anywhere"><ShieldCheck size={14} aria-hidden="true" /><span>Local network</span></span></div>
      <p className="address-hint">Enter the exact address and port shown in Wireless debugging. This page does not connect to your TV.</p>

        <details className="prompt-disclosure">
          <summary><span><b>Show the guided setup prompt</b><small>Copy it into your assistant when you’re ready</small></span><ChevronDown size={18} aria-hidden="true" /></summary>
          <div className="prompt-disclosure-content">
        <div className="prompt-heading"><div><span className="assistant-label">READY-TO-PASTE INSTRUCTIONS</span><p>Open your assistant, paste the prompt below, and follow its steps.</p></div><span className="prompt-safety"><ShieldCheck size={14} aria-hidden="true" /> You approve changes</span></div>
      <div className="prompt-tabs" role="group" aria-label="Setup prompt">
        <button type="button" aria-pressed={promptMode === "install"} className={promptMode === "install" ? "is-active" : ""} onClick={() => { setPromptMode("install"); setCopyState("Copy prompt") }}><Sparkles size={14} aria-hidden="true" /> Install tvOS 27</button>
        <button type="button" aria-pressed={promptMode === "restore"} className={promptMode === "restore" ? "is-active" : ""} onClick={() => { setPromptMode("restore"); setCopyState("Copy prompt") }}><RotateCcw size={14} aria-hidden="true" /> Restore original</button>
      </div>
      <div className="prompt-box">
        <div className="prompt-box-top"><span><span className="prompt-live-dot" /> {promptMode === "install" ? "INSTALL + SET DEFAULT" : "REVERT TO ORIGINAL HOME"}</span><span className="prompt-assistant-name">{assistant}</span></div>
        <textarea className="prompt-text" aria-label={`${promptMode === "install" ? "Install" : "Restore"} prompt to copy`} readOnly value={prompt} rows={promptMode === "install" ? 11 : 8} />
        <button type="button" className={`copy-button ${copyState === "Copied" ? "is-copied" : ""}`} onClick={copyPrompt} aria-live="polite">
          {copyState === "Copied" ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}{copyState}
        </button>
          </div>
          </div>
        </details>
      <div className="final-safety"><ShieldCheck size={16} aria-hidden="true" /><div><b>Reversible by design</b><span>The prompt asks your assistant to record the original Home app first and ask before switching. It never roots your TV or removes the stock launcher.</span></div></div>
      <div className="assistant-footnote">If wireless debugging asks for a pairing code, follow the on-screen instructions. Menus and ADB support differ by TV model.</div>
      <details className="troubleshooting"><summary>Quick fixes and a safe fallback</summary><div className="troubleshooting-content"><p><b>ADB can’t connect:</b> confirm the TV and computer are on the same network, re-check the on-screen port, and accept the authorization prompt on the TV.</p><p><b>The app won’t appear as Home:</b> don’t force it. Open Settings → Apps → Default apps → Home app and check whether the launcher is listed for this TV.</p><p><b>Want to undo it?</b> Use the “Restore original” prompt above and the original Home activity recorded before the switch.</p></div></details>
      <StepCompletion isComplete={isStepComplete} onChange={onStepCompletion} label="I installed tvOS 27 and verified the Home screen opens." detail="If you’re not ready yet, keep this page open and finish later." />
    </article>
  )
}

function StepHeader({ number, label, title, description, icon }: { number: string; label: string; title: string; description: string; icon: ReactNode }) {
  return (
    <div className="step-header">
      <div className="step-header-top"><span className="step-number-large">{number}</span><span className="step-header-icon">{icon}</span></div>
      <div className="eyebrow"><span className="eyebrow-line" /> {label}</div>
      <h2 id="step-title">{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function StepCompletion({ isComplete, onChange, label, detail }: { isComplete: boolean; onChange: (complete: boolean) => void; label: string; detail: string }) {
  return (
    <label className={`confirm-row step-completion ${isComplete ? "is-checked" : ""}`}>
      <input type="checkbox" checked={isComplete} onChange={(event) => onChange(event.target.checked)} />
      <span className="custom-check"><Check size={13} aria-hidden="true" /></span>
      <span><b>{label}</b><small>{detail}</small></span>
    </label>
  )
}

function Instruction({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="instruction-row">
      <span className="instruction-number">{number}</span>
      <div><b>{title}</b><p>{text}</p></div>
    </div>
  )
}
