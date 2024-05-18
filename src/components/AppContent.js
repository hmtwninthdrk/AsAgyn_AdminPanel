import React, { Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
    <Suspense fallback={<CSpinner color="primary" />}>
      <Outlet /> 
    </Suspense>
  </CContainer>
  )
}

export default React.memo(AppContent)
