import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-96" />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
