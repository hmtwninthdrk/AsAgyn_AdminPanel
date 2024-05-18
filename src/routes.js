import React from 'react'

const Analytics = React.lazy(() => import('./components/pages/Analytics/Analytics'))
const Menu = React.lazy(() => import('./components/pages/Menu/Menu'))
// const AddMenu = React.lazy(() => import('./components/pages/'))
// const EditMenu = React.lazy(() => import('./components/pages'))
const Orders = React.lazy(() => import('./components/pages/Orders/Orders'))
const Settings = React.lazy(() => import('./components/pages/Settings/Settings'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Analytics },
  // { path: '/analytics', name: 'Analytics', element: Analytics },

  { path: '/menu', name: 'Menu', element: Menu },
  // { path: '/menu/addMenu', name: 'AddMenu', element: AddMenu },
  // { path: '/menu/editMenu/:id', name: 'EditMenu', element: EditMenu },
  { path: '/orders', name: 'Tables', element: Orders },
  { path: '/settings', name: 'Settings', element: Settings },
  // { path: '/charts', name: 'Charts', element: Charts },
]

export default routes
