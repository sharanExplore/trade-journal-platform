import './App.css'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ValueStrip from './components/ValueStrip.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* TRUST / VALUE STRIP */}
        <ValueStrip />

        {/* FEATURES */}
        <Features />

        {/* HOW IT WORKS */}
        <HowItWorks />
        {/* FINAL CTA */}
        <FinalCTA />
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  )
}

export default App