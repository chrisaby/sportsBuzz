import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProTab from './tabs/ProTab'
import EmptyTab from './tabs/EmptyTab'

const TABS = {
  games: <EmptyTab name="Games" />,
  news:  <EmptyTab name="News" />,
  pro:   <ProTab />,
  more:  <EmptyTab name="More" />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <Header />
      <main>
        {TABS[activeTab]}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
