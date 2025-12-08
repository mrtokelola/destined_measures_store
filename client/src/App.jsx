import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductPage.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
     <div>
       <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/products" element={<ProductsPage />} />
       </Routes>
     </div>
  )
}

export default App
