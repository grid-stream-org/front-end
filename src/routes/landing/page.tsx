import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

import StaticChart from './static-chart'

import { motion } from 'framer-motion'

import CarSVG from '/src/assets/storyset/turbine.svg'
import ChartSVG from '/src/assets/storyset/env-chart.svg'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-full dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md bg-background dark:bg-gray-800 fixed w-full z-10">
        <Logo size="xl" />
        <div className="flex space-x-6">
          <Button
            variant="ghost"
            onClick={() => document.getElementById('system').scrollIntoView({ behavior: 'smooth' })}
            className="text-muted-foreground dark:text-white"
          >
            Our System
          </Button>
          <Button
            variant="ghost"
            onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
            className="text-muted-foreground dark:text-white"
          >
            About Us
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/login')}
            className="bg-primary text-muted dark:bg-primary dark:text-white"
          >
            Register/Login
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-between p-16 mt-10 min-h-screen bg-gradient-to-l from-primary to-muted">
        {/* Text Section */}
        <motion.div
          className="w-1/2 text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 3 }}
        >
          <h1 className="text-7xl font-bold mb-4 text-muted-foreground dark:text-white leading-tight">
            Powering the Future
            <br />
            <span className="text-primary dark:text-primary">One Charge at a Time</span>
          </h1>
          <p className="text-3xl text-muted-foreground mb-8 max-w-xl dark:text-gray-300">
            Optimize your DER2G contracts effortlessly with our intelligent, user-friendly platform.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/login')}
            className="bg-primary text-primary-foreground dark:bg-primary dark:text-white px-8 py-3 text-xl"
          >
            Get Started
          </Button>
        </motion.div>

        {/* SVG Section */}
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
        className="p-16 bg-muted min-h-screen flex flex-col md:flex-row items-center dark:muted dark:text-white"
      >
        {/* Chart Section */}
        <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8">
          <StaticChart />
        </div>

        {/* System Information Section */}
        <div className="w-full md:w-1/2 p-8 bg-white shadow-lg rounded-2xl text-lg dark:bg-gray-900 dark:text-white">
          <h2 className="text-5xl font-bold mb-6 text-muted-foreground dark:text-white">
            Our System
          </h2>
          <p className="text-2xl text-muted-foreground mb-8 dark:text-gray-300">
            Our platform integrates with multiple energy providers, offering dynamic contract
            adjustments, predictive analytics, and a user-friendly dashboard for real-time
            monitoring.
          </p>

          {/* "How It Works" Section - Only visible on md and up */}
          <div className="hidden xl:block">
            <h2 className="text-4xl font-bold mt-12 mb-6 text-muted-foreground dark:text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="p-8 bg-white shadow-lg rounded-2xl border-2 border-muted dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-muted-foreground dark:text-white">
                  Step 1: Register
                </h3>
                <p className="text-xl mb-4 text-muted-foreground dark:text-gray-300">
                  Create an account and connect your DERs to our platform.
                </p>
              </div>
              <div className="p-8 bg-white shadow-lg rounded-2xl border-2 border-muted dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-muted-foreground dark:text-white">
                  Step 2: Choose Your Contract
                </h3>
                <p className="text-xl mb-4 text-muted-foreground dark:text-gray-300">
                  Select from flexible contract options that are in your best interest.
                </p>
              </div>
              <div className="p-8 bg-white shadow-lg rounded-2xl border-2 border-muted dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-muted-foreground dark:text-white">
                  Step 3: Start Earning
                </h3>
                <p className="text-xl mb-4 text-muted-foreground dark:text-gray-300">
                  Plug in and let our system handle the rest while you enjoy passive income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div
        id="about"
        className="p-16 min-h-screen flex justify-center bg-gradient-to-t from-secondary to-muted dark:secondary dark:to-muted"
      >
        <div className="w-3/4 p-8 bg-white shadow-lg rounded-2xl text-lg dark:bg-gray-900 dark:text-white">
          <h2 className="text-4xl font-bold mb-6 text-muted-foreground dark:text-white">
            About Us
          </h2>
          <p className="text-lg text-muted-foreground mb-6 dark:text-gray-300">
            GridStream is revolutionizing DER2G technology by effectively managing and validating
            Distributed Energy Resource (DER) contracts between residential users and power
            operators. Our goal is to provide seamless integration, optimize energy distribution,
            and ensure that users can maximize both their financial and environmental benefits. By
            facilitating contract management, GridStream helps residential users to participate in
            energy markets while creating a more sustainable grid.
          </p>
          <Button
            variant="default"
            className="bg-primary text-primary-foreground dark:bg-primary dark:text-white"
          >
            <a href="mailto:admin@gridstream.app?subject=Contact%20Request">Contact Us</a>
          </Button>
          <img src={ChartSVG} alt="Car illustration" className="block mx-auto w-1/2 h-2/3" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
