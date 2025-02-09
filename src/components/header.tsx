import { ThemeToggle } from '@/components'
import { SidebarTrigger } from '@/components/ui'

export const Header = () => (
  <header className="flex items-center justify-between w-full p-2 shadow h-[48px]">
    <SidebarTrigger size="icon" />
    <ThemeToggle />
  </header>
)
