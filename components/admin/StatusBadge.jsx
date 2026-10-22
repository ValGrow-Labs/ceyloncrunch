const STATUS_COLORS = {
  pending:   { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
  paid:      { bg: '#dcfce7', color: '#166534', label: 'Paid' },
  shipped:   { bg: '#dbeafe', color: '#1e40af', label: 'Shipped' },
  delivered: { bg: '#f0fdf4', color: '#15803d', label: 'Delivered' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  failed:    { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
  active:    { bg: '#dcfce7', color: '#166534', label: 'Active' },
  inactive:  { bg: '#f3f4f6', color: '#6b7280', label: 'Inactive' },
  admin:     { bg: '#ede9fe', color: '#6d28d9', label: 'Admin' },
  super_admin: { bg: '#fef3c7', color: '#92400e', label: 'Super Admin' },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const s = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#6b7280', label: status }
  return (
    <span style={{
      display: 'inline-block', padding: size === 'sm' ? '3px 10px' : '5px 14px',
      borderRadius: 50, fontSize: size === 'sm' ? 12 : 13, fontWeight: 600,
      background: s.bg, color: s.color, textTransform: 'capitalize',
    }}>
      {s.label}
    </span>
  )
}
