import { forwardRef } from 'react'
import { waveEdge } from '../assets/index.js'

const WaveTransition = forwardRef(function WaveTransition({ trackRef }, ref) {
  return (
    <div className="wave-cover" ref={ref} aria-hidden="true">
      <div className="wave-track" ref={trackRef}>
        <img src={waveEdge} alt="" width="2400" height="420" decoding="async" draggable="false" />
        <img src={waveEdge} alt="" width="2400" height="420" decoding="async" draggable="false" />
        <img src={waveEdge} alt="" width="2400" height="420" decoding="async" draggable="false" />
      </div>
      <div className="wave-body" />
    </div>
  )
})

export default WaveTransition
