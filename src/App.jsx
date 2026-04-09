import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProTab from './tabs/ProTab'
import EmptyTab from './tabs/EmptyTab'

function renderTab(activeTab) {
  if (activeTab === 'pro') return <ProTab />
  const name = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  return <EmptyTab name={name} />
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <Header />
      <main>
        {renderTab(activeTab)}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
