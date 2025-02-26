import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-scroll'

import StaticChart from './static-chart'

import ChartSVG from '@/assets/storyset/env-chart.svg'
import CarSVG from '@/assets/storyset/turbine.svg'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

const LandingPage = () => {
  const navigate = useNavigate()
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    delay: 100,
  })

  return (
    <div className="flex flex-col w-full dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md bg-background fixed w-full z-10">
        <Link to="home" smooth={true} duration={500}>
          <Logo size="xl" />
        </Link>
        <div className="flex space-x-6">
          <Button variant="ghost" className="text-muted-foreground dark:text-white">
            <Link to="system" smooth={true} duration={500}>
              Our System
            </Link>
          </Button>
          <Button variant="ghost" className="text-muted-foreground dark:text-white">
            <Link to="about" smooth={true} duration={500}>
              About Us
            </Link>
          </Button>
          <Button variant="default" className="dark:text-white" onClick={() => navigate('/login')}>
            Register/Login
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div
        id="home"
        className="flex items-center justify-between p-16 mt-10 min-h-screen bg-gradient-to-l from-primary to-muted"
      >
        <motion.div
          className="w-1/2 text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 3 }}
        >
          <h1 className="text-7xl font-bold mb-4 text-muted-foreground dark:text-white leading-tight">
            Powering the Future
            <br />
            <span className="text-primary ">One Charge at a Time</span>
          </h1>
          <p className="text-3xl text-muted-foreground mb-8 max-w-xl">
            Optimize your DER2G contracts effortlessly with our intelligent, user-friendly platform.
          </p>
          <Button variant="default" className="dark:text-white" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </motion.div>
        <motion.div
          className="w-1/2 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3 }}
        >
          <img src={CarSVG} alt="Car illustration" className="w-3/4 h-auto" />
        </motion.div>
      </div>

      <div
        id="system"
        className="p-16 bg-muted min-h-screen flex flex-col md:flex-row items-center dark:muted"
      >
        <div ref={ref} className="w-full md:w-1/2 pr-0 md:pr-8 mb-8" style={{ minHeight: '40vh' }}>
          {inView ? <StaticChart /> : <div className="min-h-[40vh]" />}
        </div>

        <div className="w-full md:w-1/2 p-8 bg-white shadow-lg rounded-2xl text-lg dark:bg-gray-700">
          <h2 className="text-5xl font-bold mb-6 text-muted-foreground dark:text-white">
            Our System
          </h2>
          <p className="text-2xl text-muted mb-8">
            Our platform integrates with multiple energy providers, offering dynamic contract
            adjustments, predictive analytics, and a user-friendly dashboard for real-time
            monitoring.
          </p>

          <div className="hidden xl:block">
            <h2 className="text-4xl font-bold mt-12 mb-6 text-muted-foreground dark:text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="p-8 bg-white shadow-lg rounded-2xl border-muted dark:bg-muted ">
                <h3 className="text-2xl font-bold mb-4 text-muted-foreground dark:text-white">
                  Step 1: Register
                </h3>
                <p className="text-xl mb-4 text-muted-foreground">
                  Create an account and connect your DERs to our platform.
                </p>
              </div>
              <div className="p-8 bg-white shadow-lg rounded-2xl border-muted dark:bg-muted">
                <h3 className="text-2xl font-bold mb-4 text-muted-foreground dark:text-white">
                  Step 2: Choose Your Contract
                </h3>
                <p className="text-xl mb-4 text-muted-foreground">
                  Select from flexible contract options that are in your best interest.
                </p>
              </div>
              <div className="p-8 bg-white shadow-lg rounded-2xl border-muted dark:bg-muted">
                <h3 className="text-2xl font-bold mb-4 text-muted-foreground dark:text-white">
                  Step 3: Start Earning
                </h3>
                <p className="text-xl mb-4 text-muted-foreground">
                  Plug in and let our system handle the rest while you enjoy passive income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="about"
        className="p-16 min-h-screen flex justify-center bg-gradient-to-t from-secondary to-muted dark:secondary dark:to-muted"
      >
        <div className="w-3/4 p-8 bg-white shadow-lg rounded-2xl text-lg dark:bg-gray-900">
          <h2 className="text-4xl font-bold mb-6 text-muted-foreground dark:text-white">
            About Us
          </h2>
          <p className="text-lg text-muted-foreground mb-6 ">
            GridStream is revolutionizing DER2G technology by effectively managing and validating
            Distributed Energy Resource (DER) contracts between residential users and power
            operators. Our goal is to provide seamless integration, optimize energy distribution,
            and ensure that users can maximize both their financial and environmental benefits. By
            facilitating contract management, GridStream helps residential users to participate in
            energy markets while creating a more sustainable grid.
          </p>
          <Button variant="default" className="bg-primary text-primary-foreground dark:text-white">
            <a href="mailto:admin@gridstream.app?subject=Contact%20Request">Contact Us</a>
          </Button>
          <img src={ChartSVG} alt="Car illustration" className="block mx-auto w-1/2 h-2/3" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
