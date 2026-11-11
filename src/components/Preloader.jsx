import { useEffect, useState } from 'react'

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const next = Math.min(100, Math.round((1 - Math.exp(-elapsed / 1150)) * 100))
      setProgress(next)
      if (next < 100) requestAnimationFrame(tick)
      else window.setTimeout(() => setVisible(false), 450)
    }
    const frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  if (!visible) return null
  return (
    <div className="preloader" aria-label={`Loading ${progress}%`}>
      <div className="preloader-mark" aria-hidden="true"><span>✳</span><i /></div>
      <div className="preloader-count"><span>{progress}</span><b>%</b></div>
    </div>
  )
}
