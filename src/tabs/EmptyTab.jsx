export default function EmptyTab({ name }) {
  return (
    <div className="flex items-center justify-center" style={{ height: '60vh' }}>
      <p className="font-body text-on-surface-variant text-base">{name}</p>
    </div>
  )
}
