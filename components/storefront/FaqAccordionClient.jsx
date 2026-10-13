'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function FaqAccordionClient({ faqs }) {
  const [openIdx, setOpenIdx] = useState(0)

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx

        return (
          <div
            key={idx}
            style={{
              background: '#fff',
              borderRadius: 18,
              border: `1.5px solid ${isOpen ? 'var(--green)' : 'var(--border)'}`,
              overflow: 'hidden',
              boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <button
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                textAlign: 'left',
                background: isOpen ? '#f6faf7' : '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: 18,
                fontWeight: 700,
                color: isOpen ? 'var(--green-dark)' : 'var(--ink)',
                lineHeight: 1.35,
              }}>
                {faq.q}
              </span>

              <span style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isOpen ? 'var(--green)' : 'var(--cream-dark)',
                color: isOpen ? '#fff' : 'var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
                transition: 'all 0.2s ease',
                transform: isOpen ? 'rotate(180deg)' : 'none',
              }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div style={{
                padding: '0 24px 24px',
                background: '#f6faf7',
                fontSize: 15,
                color: 'var(--ink-soft)',
                lineHeight: 1.75,
                borderTop: '1px solid #e7eee9',
                paddingTop: 16,
                animation: 'fadeUp 0.2s ease both',
              }}>
                {faq.link ? (
                  <p style={{ margin: 0 }}>
                    Please refer to our{' '}
                    <Link href={faq.link.href} style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'underline' }}>
                      {faq.link.text}
                    </Link>{' '}
                    for details.
                  </p>
                ) : (
                  <p style={{ margin: 0 }}>{faq.a}</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
