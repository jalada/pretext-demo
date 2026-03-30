import { useState, useEffect, useMemo } from 'react'
import { prepare, layout } from '@chenglou/pretext'
import './App.css'

const testimonials = [
  {
    text: "\u201CAs someone who struggles with chronic illness and very complex medical issues, Sollis has been a lifesaver.\u201D",
    author: "Kelsey, Sollis Member"
  },
  {
    text: "\u201CExceptional care.\u201D",
    author: "Michael, Sollis Member"
  },
  {
    text: "\u201CI cannot say enough good things about Sollis Health. From the moment I walked in, the staff was incredibly welcoming and attentive. The doctors took the time to listen to my concerns, explain everything in detail, and develop a treatment plan that actually worked. The facility is beautiful and clean, and I never had to wait more than a few minutes. It\u2019s clear they genuinely care about their patients.\u201D",
    author: "Sarah, Sollis Member"
  },
  {
    text: "\u201CThe team at Sollis responded within minutes when I needed urgent care for my daughter. That kind of responsiveness is priceless.\u201D",
    author: "David, Sollis Member"
  },
  {
    text: "\u201CWorld class.\u201D",
    author: "Amy, Sollis Member"
  }
]

// Must match .card dimensions in App.css
const CARD_PADDING = 40
const TEXT_WIDTH = 500 - CARD_PADDING * 2
const MAX_TEXT_HEIGHT = 500 - CARD_PADDING * 2 - 30 - 30 // minus attribution, dots
const FIXED_FONT_SIZE = 42

function findOptimalSize(text: string): number {
  let lo = 20, hi = 100
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const prepared = prepare(text, `${mid}px "Playfair Display"`)
    const { height } = layout(prepared, TEXT_WIDTH, Math.round(mid * 1.15))
    if (height <= MAX_TEXT_HEIGHT) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }
  return lo
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    document.fonts.load('42px "Playfair Display"').then(() => {
      setFontReady(true)
    })
  }, [])

  const optimalSizes = useMemo(() => {
    if (!fontReady) return null
    return testimonials.map(t => findOptimalSize(t.text))
  }, [fontReady])

  if (!optimalSizes) return null

  const testimonial = testimonials[currentIndex]
  const optimalSize = optimalSizes[currentIndex]

  const dots = testimonials.map((_, i) => (
    <button
      key={i}
      className={`dot${i === currentIndex ? ' active' : ''}`}
      onClick={() => setCurrentIndex(i)}
    />
  ))

  return (
    <>
      <h1 className="page-title">
        Adaptive Testimonial Sizing with Pretext
      </h1>

      <div className="demo-container">
        <div className="demo-card-wrapper">
          <span className="demo-label">Fixed size (naive)</span>
          <div className="card">
            <div className="card-content">
              <div className="quote" style={{ fontSize: FIXED_FONT_SIZE }}>
                {testimonial.text}
              </div>
              <div className="attribution">{testimonial.author}</div>
            </div>
            <div className="dots">{dots}</div>
          </div>
        </div>

        <div className="demo-card-wrapper">
          <span className="demo-label">Pretext-optimised</span>
          <div className="card">
            <div className="card-content">
              <div className="quote" style={{ fontSize: optimalSize }}>
                {testimonial.text}
              </div>
              <div className="attribution">{testimonial.author}</div>
            </div>
            <div className="dots">{dots}</div>
            <span className="size-badge">{optimalSize}px</span>
          </div>
        </div>
      </div>

      <p className="info">
        "{testimonial.author}" — pretext computed optimal size: {optimalSize}px
        (fixed would be {FIXED_FONT_SIZE}px).
        Layout calculation is pure arithmetic — no DOM reflows needed.
      </p>
    </>
  )
}

export default App
