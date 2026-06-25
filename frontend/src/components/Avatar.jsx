export default function Avatar({ member, size = 28 }) {
  if (!member) return null
  const initials = member.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      title={member.name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: member.avatar_color || '#6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.38),
        fontWeight: 700,
        color: '#fff',
        border: '2px solid rgba(255,255,255,0.12)',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  )
}
