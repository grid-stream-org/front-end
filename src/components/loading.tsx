import { Logo } from '@/components'

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Logo showText={false} size="loading" className="animate-spin" />
    </div>
  )
}
