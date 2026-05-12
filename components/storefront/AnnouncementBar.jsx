import Link from 'next/link'

export default function AnnouncementBar({ settings }) {
  const bar = settings?.announcement_bar
  if (!bar?.enabled) return null
  return (
    <div className="announcement-bar"
      style={{ background: bar.bg_color || 'var(--green)', color: bar.text_color || '#fff' }}>
      {bar.message}
      {bar.link && bar.link_label && (
        <Link href={bar.link} style={{ marginLeft: 12, fontWeight: 700, textDecoration: 'underline', color: 'inherit' }}>
          {bar.link_label}
        </Link>
      )}
    </div>
  )
}
