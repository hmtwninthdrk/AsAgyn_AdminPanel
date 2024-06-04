import React from 'react'


import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { cilAlarm, cilCalculator, cilRestaurant } from '@coreui/icons'
import { NavLink } from 'react-router-dom'

const AppSidebar = () => {
  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
    >
      <CSidebarHeader className="border-bottom">
        <NavLink to="/" style={{color:"white", display:"flex",gap:"15px", alignItems:'center', textDecoration:"none"}}>
          <CIcon icon={cilRestaurant} height={25} />
          <span style={{fontSize:"20px"}}>AsAgyn Dashboard</span>
        </NavLink>
        
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
