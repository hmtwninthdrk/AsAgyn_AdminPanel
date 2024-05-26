import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import routes from './routes'
import PrivateRoute from './utils/PrivateRoute'
import { PusherProvider } from './components/Pusher/PusherProvider'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./components/pages/login/Login'))
const Establishment = React.lazy(() => import('./components/pages/Establishment/Establishment'))

const Page404 = React.lazy(() => import('./components/pages/page404/Page404'))

const App = () => {
  return (
    <BrowserRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/establishment" element={<Establishment />} />{' '}
              <Route element={<DefaultLayout />}>
                {routes.map(({ path, element }, index) => (
                  <Route key={index} path={path} element={element} />
                ))}
              </Route>
            </Route>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="*" name="Error404" element={<Page404 />} />
          </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default App
