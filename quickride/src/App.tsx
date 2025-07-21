
import './App.css'
import './LandingPage/components/Navbar'
import Navbar from './LandingPage/components/Navbar'
import Hero from './LandingPage/components/Hero'
import Fleet from './LandingPage/components/Fleet'
import HowItWorks from './LandingPage/components/Howitworks'
import Testimonials from './LandingPage/components/Testimonials'
import Footer from './LandingPage/components/Footer'

function App() {
  

  return (
    <>
     <Navbar/>
     <Hero/>
     <Fleet/>
     <HowItWorks/>
     <Testimonials/>
     <Footer/>
    </>
  )
}

export default App
