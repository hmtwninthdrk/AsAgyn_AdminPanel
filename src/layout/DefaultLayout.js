import React from 'react'
import { AppContent, AppSidebar, AppHeader } from '../components/index'
import { PusherProvider } from '../components/Pusher/PusherProvider'

const DefaultLayout = () => {
  return (
    <PusherProvider>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
        </div>
      </div>
    </PusherProvider>
  )
}

export default DefaultLayout
