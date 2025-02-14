import { Outlet } from 'react-router-dom'

import { AppSidebar, Header } from '@/components'
import { SidebarProvider } from '@/components/ui'
import { MqttProvider } from '@/context'

export const AppLayout = () => (
  <SidebarProvider>
    <MqttProvider>
      <div className="flex h-svh w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="h-full p-6 overflow-x-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </MqttProvider>
  </SidebarProvider>
)
