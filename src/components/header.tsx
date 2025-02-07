import { ThemeToggle } from '@/components'
import { SidebarTrigger } from '@/components/ui'

export const Header = () => (
  <header className="flex items-center justify-between w-full p-1">
    <SidebarTrigger size="icon" />
    <ThemeToggle />
  </header>
)
