import { useNavigate } from 'react-router-dom'

import NotFound from '@/assets/storyset/404-not-found.svg'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground p-4">
      <img src={NotFound} alt="Not Found" className="w-full max-w-md mb-8" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6 text-center">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button onClick={() => navigate('/app/dashboard')}>Go Back Home</Button>
      <p className="text-sm text-muted-foreground mt-4">
        <a
          href="https://storyset.com/web"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Web illustrations by Storyset
        </a>
      </p>
    </div>
  )
}

export default NotFoundPage
