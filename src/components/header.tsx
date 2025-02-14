import { SearchBar, ThemeToggle, NotificationBell } from '@/components'
import { SidebarTrigger } from '@/components/ui'

export const Header = () => (
  <header className="flex items-center justify-stretch w-full px-1 gap-1 shadow border-b border-border h-[49px]">
    <SidebarTrigger size="icon" />
    <SearchBar />
    <NotificationBell />
    <ThemeToggle />
  </header>
)
