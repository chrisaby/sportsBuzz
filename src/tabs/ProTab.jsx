import { BookOpen } from 'lucide-react'
import StatusRing from '../components/StatusRing'
import QuestCard from '../components/QuestCard'
import SkillTree from '../components/SkillTree'
import FeaturedCard from '../components/FeaturedCard'
import quests from '../config/quests.json'
import featured from '../config/featured.json'

export default function ProTab() {
  return (
    <div className="pb-24">
      {/* Current Status */}
      <StatusRing />

      {/* Active Quests / Challenges */}
      <section className="px-4 pt-2 pb-4">
        <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
          Active Quests
        </p>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display font-bold text-white text-3xl">Challenges</h2>
          <button type="button" className="font-body text-primary text-sm font-bold underline underline-offset-2 decoration-secondary">
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {quests.map((quest) => (
            <QuestCard key={quest.id} {...quest} />
          ))}
        </div>

        {/* Pro Tips Banner */}
        <div
          className="mt-3 rounded-xl p-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #3766ff, #95aaff)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-white text-xs uppercase tracking-wide">
              Pro Tips: Peak Recovery
            </p>
            <p className="font-body text-white/60 text-xs mt-0.5 truncate">
              Unlock the secrets of athlete sleep cycles.
            </p>
          </div>
          <button type="button" className="bg-white text-primary-dim text-xs font-display font-bold uppercase px-3 py-2 rounded-md flex-shrink-0">
            Read Now
          </button>
        </div>
      </section>

      {/* Skill Tree */}
      <SkillTree />

      {/* Featured Content */}
      <section className="px-4 pb-4">
        <div className="flex flex-col gap-4">
          {featured.map((item) => (
            <FeaturedCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
