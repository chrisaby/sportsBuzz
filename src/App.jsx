import { useState, useCallback } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProTab from './tabs/ProTab'
import EmptyTab from './tabs/EmptyTab'
import GamesTab from './tabs/GamesTab'
import UpdateToast from './components/UpdateToast'

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')
  const [inGame, setInGame] = useState(false)
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const handleDismiss = useCallback(() => setNeedRefresh(false), [setNeedRefresh])

  function renderTab() {
    if (activeTab === 'pro') return <ProTab />
    if (activeTab === 'games') return <GamesTab onGameChange={setInGame} />
    const name = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    return <EmptyTab name={name} />
  }

  const showHeader = !(activeTab === 'games' && inGame)

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {needRefresh && (
        <UpdateToast
          updateServiceWorker={updateServiceWorker}
          onDismiss={handleDismiss}
        />
      )}
      {showHeader && <Header />}
      <main>
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
