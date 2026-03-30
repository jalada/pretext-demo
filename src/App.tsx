import { useState, useEffect, useMemo, useCallback } from 'react'
import { prepare, layout } from '@chenglou/pretext'
import './App.css'

interface Testimonial {
  text: string
  author: string
}

const testimonials: Testimonial[] = [
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

const CARD_WIDTH = 500
const CARD_PADDING = 40
const ATTR_HEIGHT = 30
const DOTS_HEIGHT = 30
const FIXED_FONT_SIZE = 42
const MAX_TEXT_HEIGHT = CARD_WIDTH - (CARD_PADDING * 2) - ATTR_HEIGHT - DOTS_HEIGHT
const TEXT_WIDTH = CARD_WIDTH - (CARD_PADDING * 2)

function findOptimalSize(text: string, minSize: number, maxSize: number): number {
  for (let size = maxSize; size >= minSize; size -= 1) {
    const fontStr = `${size}px "Playfair Display"`
    const lineHeight = Math.round(size * 1.15)
    const prepared = prepare(text, fontStr)
    const result = layout(prepared, TEXT_WIDTH, lineHeight)
    if (result.height <= MAX_TEXT_HEIGHT) {
      return size
    }
  }
  return minSize
}

interface CardProps {
  testimonial: Testimonial
  fontSize: number
  index: number
  total: number
  onSelect: (i: number) => void
  label: string
  badge?: string
}

function Card({ testimonial, fontSize, index, total, onSelect, label, badge }: CardProps) {
  return (
    <div className="demo-card-wrapper">
      <span className="demo-label">{label}</span>
      <div className="card">
        <div className="card-content">
          <div className="quote" style={{ fontSize }}>
            {testimonial.text}
          </div>
          <div className="attribution">{testimonial.author}</div>
        </div>
        <div className="dots">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              className={`dot${i === index ? ' active' : ''}`}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
        {badge && <span className="size-badge">{badge}</span>}
      </div>
    </div>
  )
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    document.fonts.load('42px "Playfair Display"').then(() => {
      setFontReady(true)
    })
  }, [])

  const optimalSize = useMemo(() => {
    if (!fontReady) return FIXED_FONT_SIZE
    return findOptimalSize(testimonials[currentIndex].text, 20, 100)
  }, [currentIndex, fontReady])

  const handleSelect = useCallback((i: number) => setCurrentIndex(i), [])

  if (!fontReady) return null

  const testimonial = testimonials[currentIndex]

  return (
    <>
      <h1 className="page-title">
        Adaptive Testimonial Sizing with Pretext
      </h1>

      <div className="demo-container">
        <Card
          testimonial={testimonial}
          fontSize={FIXED_FONT_SIZE}
          index={currentIndex}
          total={testimonials.length}
          onSelect={handleSelect}
          label="Fixed size (naive)"
        />
        <Card
          testimonial={testimonial}
          fontSize={optimalSize}
          index={currentIndex}
          total={testimonials.length}
          onSelect={handleSelect}
          label="Pretext-optimised"
          badge={`${optimalSize}px`}
        />
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
