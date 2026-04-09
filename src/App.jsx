import Header from './components/Header'
import QuestCard from './components/QuestCard'
import quests from './config/quests.json'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Header />
      <div className="flex flex-col gap-3 mt-4">
        {quests.map((q) => <QuestCard key={q.id} {...q} />)}
      </div>
    </div>
  )
}
