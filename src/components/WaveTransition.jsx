import { forwardRef } from 'react'
import { waveEdge } from '../assets/index.js'

const WaveTransition = forwardRef(function WaveTransition(_, ref) {
  return (
    <div className="wave-cover" ref={ref} aria-hidden="true">
      <div className="wave-track">
        <img src={waveEdge} alt="" width="2400" height="420" />
        <img src={waveEdge} alt="" width="2400" height="420" />
        <img src={waveEdge} alt="" width="2400" height="420" />
      </div>
      <div className="wave-body" />
    </div>
  )
})

export default WaveTransition
