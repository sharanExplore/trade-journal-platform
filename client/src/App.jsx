import { useState } from 'react'
import './App.css'

import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ValueStrip from './components/ValueStrip.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'

function App() {
  const [page, setPage] = useState('landing')

  if (page === 'register') {
    return <Register />
  }
  if (page === 'login') {
    return <Login />
  }

  return (
    <>
      <Navbar
        onGetStarted={() => setPage('register')}
        onLogin={() => setPage('login')}
      />

      <main>
        <Hero />
        <ValueStrip />
        <Features />
        <HowItWorks />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}

export default App