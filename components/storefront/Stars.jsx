export default function Stars({ rating, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)))
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 14 14">
              <polygon points="7,1 8.8,5.5 13.6,5.9 10,9 11.1,13.8 7,11.1 2.9,13.8 4,9 0.4,5.9 5.2,5.5" fill="#e5ddd0" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${fill * 100}%` }}>
              <svg width={size} height={size} viewBox="0 0 14 14">
                <polygon points="7,1 8.8,5.5 13.6,5.9 10,9 11.1,13.8 7,11.1 2.9,13.8 4,9 0.4,5.9 5.2,5.1" fill="var(--gold)" />
              </svg>
            </span>
          </span>
        )
      })}
    </span>
  )
}
