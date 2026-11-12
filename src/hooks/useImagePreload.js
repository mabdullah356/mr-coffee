import { useEffect, useRef, useState } from 'react'

export default function useImagePreload(sources, minimumMs = 0) {
  const total = sources.length + 1
  const [loaded, setLoaded] = useState(0)
  const [done, setDone] = useState(false)
  const started = useRef(0)

  useEffect(() => {
    let cancelled = false
    started.current = performance.now()
    let settled = 0
    const settle = () => {
      if (cancelled) return
      settled += 1
      setLoaded(settled)
      if (settled >= total) {
        const wait = Math.max(0, minimumMs - (performance.now() - started.current))
        window.setTimeout(() => { if (!cancelled) setDone(true) }, wait)
      }
    }

    const fontPromise = document.fonts?.ready?.then(settle) ?? Promise.resolve().then(settle)
    const images = sources.map((src) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
      if (image.complete) return image.decode?.().catch(() => {}).then(settle)
      return new Promise((resolve) => {
        image.onload = () => {
          image.decode?.().catch(() => {}).finally(() => { settle(); resolve() })
        }
        image.onerror = () => { settle(); resolve() }
      })
    })

    Promise.all([fontPromise, ...images]).catch(() => {})

    return () => { cancelled = true }
  }, [sources, total, minimumMs])

  return { progress: Math.min(1, loaded / total), done }
}
