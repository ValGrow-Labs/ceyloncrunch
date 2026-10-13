'use client'
import { useState } from 'react'
import Link from 'next/link'
import { IconCheck, IconStar } from './Icons'

export default function ReviewsClient({ initialReviews = [] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [reviewsList, setReviewsList] = useState(initialReviews)
  const [filterRating, setFilterRating] = useState('all')

  const [form, setForm] = useState({
    name: '',
    rating: 5,
    text: '',
    orderNumber: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.text) return

    const newReview = {
      name: form.name.trim(),
      init: form.name.trim().slice(0, 2).toUpperCase(),
      rating: Number(form.rating),
      text: form.text.trim(),
      date: 'Just now',
      verified: true,
    }

    setReviewsList([newReview, ...reviewsList])
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setModalOpen(false)
      setForm({ name: '', rating: 5, text: '', orderNumber: '' })
    }, 2000)
  }

  const filteredReviews = filterRating === 'all'
    ? reviewsList
    : reviewsList.filter(r => r.rating === Number(filterRating))

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '50px 24px 100px' }}>

      {/* ── 1. PAGE HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 10,
        }}>
          CUSTOMER REVIEWS
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 14,
          letterSpacing: '-0.02em',
        }}>
          What Our Customers Say
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 580,
          margin: '0 auto 28px',
          lineHeight: 1.6,
        }}>
          We appreciate every order and every piece of feedback.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          style={{ padding: '14px 34px', fontSize: 15, borderRadius: 50, fontWeight: 700 }}
        >
          LEAVE A REVIEW
        </button>
      </div>

      {/* ── 2. RATING SUMMARY OVERVIEW CARD ── */}
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '36px 32px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 32,
        alignItems: 'center',
        marginBottom: 44,
      }}>
        {/* Rating Number */}
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)', paddingRight: 24 }}>
          <div style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 56,
            fontWeight: 700,
            color: 'var(--green-dark)',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            4.8
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <IconStar key={star} size={20} filled={true} color="var(--gold)" />
            ))}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
            4.8 ★ Average Rating
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            Based on verified purchases across Sri Lanka
          </div>
        </div>

        {/* Rating Breakdown & Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 4 }}>
            Rating Breakdown:
          </div>

          {[
            { stars: '5 Stars', count: '88%', num: 5 },
            { stars: '4 Stars', count: '12%', num: 4 },
            { stars: '3 Stars', count: '0%', num: 3 },
            { stars: '2 Stars', count: '0%', num: 2 },
            { stars: '1 Star', count: '0%', num: 1 },
          ].map((bar) => (
            <div
              key={bar.stars}
              onClick={() => setFilterRating(filterRating === String(bar.num) ? 'all' : String(bar.num))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                cursor: 'pointer',
                opacity: filterRating === 'all' || filterRating === String(bar.num) ? 1 : 0.45,
                transition: 'opacity 0.2s',
              }}
            >
              <span style={{ minWidth: 55, fontWeight: 600, color: 'var(--ink-soft)' }}>{bar.stars}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--cream-dark)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  width: bar.count,
                  height: '100%',
                  background: 'var(--green)',
                  borderRadius: 10,
                }} />
              </div>
              <span style={{ minWidth: 35, textAlign: 'right', color: 'var(--muted)' }}>{bar.count}</span>
            </div>
          ))}

          {filterRating !== 'all' && (
            <button
              onClick={() => setFilterRating('all')}
              style={{ alignSelf: 'flex-start', fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 4, textDecoration: 'underline' }}
            >
              Reset filter (Showing {filterRating}★ only)
            </button>
          )}
        </div>
      </div>

      {/* ── 3. REVIEWS LIST ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 16, color: 'var(--muted)' }}>No reviews found for this rating filter.</p>
            <button onClick={() => setFilterRating('all')} className="btn-outline" style={{ marginTop: 12, fontSize: 13 }}>
              View All Reviews
            </button>
          </div>
        ) : (
          filteredReviews.map((rev, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '28px 28px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {rev.init || rev.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                      {rev.name}
                    </div>
                    {rev.verified && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 2 }}>
                        <IconCheck size={14} color="var(--green)" />
                        <span>Verified Purchase</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4, 5].map(st => (
                      <IconStar key={st} size={15} filled={st <= rev.rating} color="var(--gold)" />
                    ))}
                  </div>
                  {rev.date && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                      {rev.date}
                    </div>
                  )}
                </div>
              </div>

              <p style={{
                fontSize: 15,
                color: 'var(--ink-soft)',
                lineHeight: 1.75,
                margin: 0,
                marginTop: 4,
              }}>
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>
          ))
        )}
      </div>

      {/* ── 4. LEAVE A REVIEW MODAL / UI ── */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: '36px 32px',
            maxWidth: 520,
            width: '100%',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            position: 'relative',
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
            >
              ✕
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: 24,
                }}>
                  ✓
                </div>
                <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>
                  Thank You for Your Feedback!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  Your review has been recorded. We appreciate you taking the time to share your experience with Ceylon Crunch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>
                    Leave a Review
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                    Share your experience with our products and delivery.
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Nimal Perera"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Order Number (Optional)</label>
                  <input
                    type="text"
                    value={form.orderNumber}
                    onChange={e => setForm({ ...form, orderNumber: e.target.value })}
                    placeholder="e.g. CC-2026-XXXXXX"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Rating *</label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setForm({ ...form, rating: num })}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: `1.5px solid ${form.rating >= num ? 'var(--gold)' : 'var(--border)'}`,
                          background: form.rating >= num ? '#fffdf5' : '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <IconStar size={20} filled={form.rating >= num} color="var(--gold)" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Review Text *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.text}
                    onChange={e => setForm({ ...form, text: e.target.value })}
                    placeholder="Tell us what you liked about the freshness, taste, and packaging..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '13px', fontSize: 15 }}
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn-outline"
                    style={{ padding: '13px 20px', fontSize: 14 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--ink-soft)',
  marginBottom: 6,
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 12,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  boxSizing: 'border-box',
}
