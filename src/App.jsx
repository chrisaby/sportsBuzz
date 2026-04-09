import Header from './components/Header'
import FeaturedCard from './components/FeaturedCard'
import featured from './config/featured.json'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Header />
      <div className="flex flex-col gap-4 mt-4">
        {featured.map((item) => <FeaturedCard key={item.id} {...item} />)}
      </div>
    </div>
  )
}
