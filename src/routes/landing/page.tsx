import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-scroll'

import StaticChart from './static-chart'

import ChartSVG from '@/assets/storyset/env-chart.svg'
import TurbineSVG from '@/assets/storyset/turbine.svg'
import { ThemeToggle } from '@/components'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

const LandingPage = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'Our System', to: 'system' },
    { name: 'About Us', to: 'about' },
  ]

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-background/90 backdrop-blur-sm z-50 shadow-sm">
        <Link to="home" smooth={true} duration={500} className="cursor-pointer">
          <Logo size="lg" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map(link => (
            <Button key={link.to} variant="ghost">
              <Link to={link.to} smooth={true} duration={500} className="cursor-pointer">
                {link.name}
              </Link>
            </Button>
          ))}
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden bg-background pt-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center p-6 space-y-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className="w-full text-center py-4 text-lg hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="outline"
              className="w-full py-4 text-lg"
              onClick={() => {
                navigate('/login')
                setMobileMenuOpen(false)
              }}
            >
              Login
            </Button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-24 pb-16 px-6 lg:px-12 min-h-screen flex items-center bg-gradient-to-l from-primary to-muted"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="w-full md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Powering the Future
                <br />
                <span className="text-primary">One Charge at a Time</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                Optimize your DER2G contracts effortlessly with our intelligent, user-friendly
                platform.
              </p>
              <Button size="lg" className="shadow-md" onClick={() => navigate('/login')}>
                Get Started
              </Button>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <img src={TurbineSVG} alt="Turbine illustration" className="w-full max-w-md h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* System Section */}
      <section id="system" className="py-16 px-6 lg:px-12 bg-muted">
        <div className="container mx-auto">
          <div className="w-full p-6 md:p-8 bg-card rounded-xl shadow-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our System</h2>
            <p className="text-lg mb-8">
              Our platform integrates with multiple energy providers, offering dynamic contract
              adjustments, predictive analytics, and a user-friendly dashboard for real-time
              monitoring.
            </p>

            <div>
              <h3 className="text-2xl font-bold mt-8 mb-6">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Step 1: Register',
                    description: 'Create an account and connect your DERs to our platform.',
                  },
                  {
                    title: 'Step 2: Choose Your Contract',
                    description:
                      'Select from flexible contract options that are in your best interest.',
                  },
                  {
                    title: 'Step 3: Start Earning',
                    description:
                      'Plug in and let our system handle the rest while you enjoy passive income.',
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="p-6 bg-card shadow-sm border rounded-lg transition-all hover:shadow-md"
                  >
                    <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={ref} className="w-full mt-12">
            {inView ? <StaticChart /> : <div className="h-96" />}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 lg:px-12 bg-gradient-to-t from-secondary to-muted">
        <div className="container mx-auto">
          <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-card shadow-md rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
                <p className="mb-4">
                  GridStream is revolutionizing DER2G technology by effectively managing and
                  validating Distributed Energy Resource (DER) contracts between residential users
                  and power operators. Our goal is to provide seamless integration, optimize energy
                  distribution, and ensure that users can maximize both their financial and
                  environmental benefits.
                </p>
                <p className="mb-6">
                  By facilitating contract management, GridStream helps residential users to
                  participate in energy markets while creating a more sustainable grid.
                </p>
                <Button>
                  <a href="mailto:admin@gridstream.app">Contact Us</a>
                </Button>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <img src={ChartSVG} alt="Chart illustration" className="w-full max-w-sm h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted px-6 py-12 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size="lg" />
              <p className="mt-4 text-muted-foreground">
                Optimizing energy distribution for a greener future.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['home', 'system', 'about'].map(link => (
                  <li key={link}>
                    <Link
                      to={link}
                      smooth={true}
                      duration={500}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-muted-foreground mb-2">
                <a
                  href="mailto:admin@gridstream.app"
                  className="hover:text-primary transition-colors"
                >
                  admin@gridstream.app
                </a>
              </p>
              <p className="text-muted-foreground">Fredericton, NB</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GRIDSTREAM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
