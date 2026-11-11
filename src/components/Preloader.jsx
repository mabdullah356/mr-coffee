import { useEffect, useState } from 'react'

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let disposed = false
    let frame = 0
    let ready = false
    let loaded = 0
    let displayed = 0
    const started = performance.now()
    const images = [...document.images]
    const total = images.length + 1
    const settleImage = async (image) => {
      if (!image.complete) {
        try { await image.decode() } catch { /* a failed image has still settled */ }
      }
      loaded += 1
    }
    const resources = Promise.all([document.fonts.ready.then(() => { loaded += 1 }), ...images.map(settleImage)])
    resources.then(() => { ready = true })

    const animate = () => {
      if (disposed) return
      const goal = ready ? 100 : Math.min(99, (loaded / total) * 100)
      const next = displayed + (goal - displayed) * 0.12
      displayed = Math.abs(goal - next) < 0.2 ? goal : next
      setProgress(displayed)
      const elapsed = performance.now() - started
      if (ready && elapsed >= 900 && displayed >= 99.5) {
        setProgress(100)
        setLeaving(true)
        window.setTimeout(() => { if (!disposed) { setVisible(false); onComplete?.() } }, 820)
        return
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => { disposed = true; cancelAnimationFrame(frame) }
  }, [onComplete])

  if (!visible) return null
  const shownProgress = Math.min(100, Math.round(progress))
  return <div className={`preloader ${leaving ? 'is-leaving' : ''}`} role="progressbar" aria-label="Loading page assets" aria-valuemin="0" aria-valuemax="100" aria-valuenow={shownProgress}>
    <div className="preloader-mark" aria-hidden="true"><span>✳</span><i /></div>
    <div className="preloader-count"><span>{shownProgress}</span><b>%</b></div>
  </div>
}
