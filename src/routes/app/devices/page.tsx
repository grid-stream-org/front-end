import { useLocation } from 'react-router-dom'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'

const DevicesPage = () => {
  const location = useLocation()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
    </>
  )
}

export default DevicesPage
