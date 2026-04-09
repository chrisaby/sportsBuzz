// gradient must be a complete Tailwind class string (e.g. "from-indigo-900 via-blue-800 to-slate-900")
// sourced from featured.json — Tailwind scans that file via the content glob in tailwind.config.js
export default function FeaturedCard({ tag, title, description, gradient = 'from-surface-high to-surface-low' }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${gradient}`}
      style={{ aspectRatio: '16/9' }}
      aria-label={title}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="inline-block bg-secondary text-background text-xs font-display font-bold uppercase tracking-wide px-2 py-0.5 rounded-md mb-2">
          {tag}
        </span>
        <h3 className="font-display font-bold text-white text-2xl leading-tight mb-1">
          {title}
        </h3>
        <p className="font-body text-on-surface-variant text-sm">{description}</p>
      </div>
    </div>
  )
}
