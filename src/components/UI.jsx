import React from 'react'

const s = {
  panel: {
    background: 'var(--color-bg)',
    border: '0.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    marginBottom: '1rem',
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
}

export function Panel({ children, style }) {
  return <div style={{ ...s.panel, ...style }}>{children}</div>
}

export function PanelTitle({ children, style }) {
  return <div style={{ ...s.panelTitle, ...style }}>{children}</div>
}

export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue:   { background: 'var(--blue-50)',  color: 'var(--blue-800)' },
    green:  { background: 'var(--green-50)', color: 'var(--green-800)' },
    amber:  { background: 'var(--amber-50)', color: 'var(--amber-800)' },
    red:    { background: 'var(--red-50)',   color: 'var(--red-600)' },
    teal:   { background: 'var(--teal-50)',  color: 'var(--teal-800)' },
    gray:   { background: 'var(--gray-50)',  color: 'var(--gray-600)' },
  }
  return (
    <span style={{
      fontSize: 11, padding: '3px 8px',
      borderRadius: 'var(--radius-md)', fontWeight: 500,
      ...variants[variant],
    }}>
      {children}
    </span>
  )
}

export function Btn({ children, variant = 'secondary', size = 'md', onClick, style, disabled }) {
  const base = {
    fontWeight: 500, borderRadius: 'var(--radius-md)',
    border: '0.5px solid var(--color-border-strong)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
    outline: 'none',
  }
  const sizes = {
    sm: { fontSize: 12, padding: '5px 12px' },
    md: { fontSize: 13, padding: '7px 16px' },
  }
  const variants = {
    primary:   { background: 'var(--blue-600)', color: '#fff', border: 'none' },
    secondary: { background: 'transparent', color: 'var(--color-text-primary)' },
    danger:    { background: 'var(--red-50)', color: 'var(--red-600)', border: '0.5px solid var(--red-100)' },
    ghost:     { background: 'transparent', color: 'var(--color-text-secondary)', border: 'none' },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}

export function Grid({ cols = 2, gap = 12, children, style }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  )
}

export function Actions({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 8, justifyContent: 'flex-end',
      marginTop: '1rem', paddingTop: '1rem',
      borderTop: '0.5px solid var(--color-border)',
    }}>
      {children}
    </div>
  )
}

export function ProgressMini({ value, max = 100, color = 'var(--blue-600)' }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ height: 4, borderRadius: 2, background: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: 2, background: color, width: `${pct}%`, transition: 'width 0.3s' }} />
    </div>
  )
}

export function MetricCard({ label, value }) {
  return (
    <div style={{
      background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)',
      padding: '12px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export function AiBox({ title, children, onMore, moreLabel }) {
  return (
    <div style={{
      background: 'var(--blue-50)', border: '0.5px solid var(--blue-100)',
      borderRadius: 'var(--radius-md)', padding: '10px 12px', marginTop: 10,
    }}>
      <div style={{ fontSize: 11, color: 'var(--blue-600)', fontWeight: 500, marginBottom: 6 }}>
        {title}
      </div>
      {children}
      {onMore && (
        <div style={{ marginTop: 8 }}>
          <Btn size="sm" onClick={onMore}>{moreLabel} ↗</Btn>
        </div>
      )}
    </div>
  )
}

export function WarnBox({ title, children }) {
  return (
    <div style={{
      background: 'var(--amber-50)', border: '0.5px solid var(--amber-100)',
      borderRadius: 'var(--radius-md)', padding: '10px 12px', marginTop: 8,
    }}>
      <div style={{ fontSize: 11, color: 'var(--amber-600)', fontWeight: 500, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--amber-800)' }}>{children}</div>
    </div>
  )
}

export function NavBack({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        fontSize: 12, color: 'var(--color-text-secondary)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1rem',
      }}
    >
      ← Toate proiectele
    </div>
  )
}

export function ScoreBadge({ value }) {
  const cls = value >= 8 ? { bg: 'var(--green-50)', color: 'var(--green-800)' }
             : value >= 6 ? { bg: 'var(--amber-50)', color: 'var(--amber-800)' }
             : { bg: 'var(--red-50)', color: 'var(--red-600)' }
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 500, flexShrink: 0,
      background: cls.bg, color: cls.color,
    }}>
      {value}
    </div>
  )
}

export function ScoreColor({ value, max = 10 }) {
  if (value >= max * 0.8) return 'var(--green-600)'
  if (value >= max * 0.6) return 'var(--amber-600)'
  return 'var(--red-600)'
}
