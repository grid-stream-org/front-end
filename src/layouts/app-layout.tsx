import { Outlet } from 'react-router-dom'

import { AppSidebar, Header } from '@/components'
import { SidebarProvider } from '@/components/ui'

export const AppLayout = () => (
  <SidebarProvider>
    <div className="flex min-h-svh w-full">
      <AppSidebar />
      <div className="flex w-full flex-col">
        <div className="sticky top-0 z-10 bg-background">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
)
