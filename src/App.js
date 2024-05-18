import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import routes from './routes'
import PrivateRoute from './utils/PrivateRoute'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

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
          <Route element={<PrivateRoute/>}>
            <Route element={<DefaultLayout />}>
              {routes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
              ))}
            </Route>
          </Route>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="*" name="Error404" element={<Page404/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
