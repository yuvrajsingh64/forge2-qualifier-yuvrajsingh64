export default function TagBadge({ tag, onRemove }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 10px',
        borderRadius: 100,
        background: tag.color + '22',
        color: tag.color,
        border: `1px solid ${tag.color}55`,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(tag) }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: tag.color,
            padding: 0,
            fontSize: 13,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  )
}
