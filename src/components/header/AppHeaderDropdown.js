import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/avatar.png'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {

  const navigate = useNavigate()
  const SignOut = () => {
    console.log('Before sign out:')
    console.log('accessToken:', sessionStorage.getItem('accessToken'))
    console.log('reduxState:', sessionStorage.getItem('reduxState'))

    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('reduxState')

    console.log('After sign out:')
    console.log('accessToken:', sessionStorage.getItem('accessToken'))
    console.log('reduxState:', sessionStorage.getItem('reduxState'))

    navigate('/login')
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Аккаунт</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Настройки
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={SignOut}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Выход
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
