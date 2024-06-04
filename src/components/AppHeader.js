import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import usePusherEvent from './Pusher/usePusherSubscription'
const AppHeader = () => {
  const [readNotifications, setReadNotifications] = useState([])
  const [notifications, setNotifications] = useState([])
  usePusherEvent('AsAgyn-channel', 'request-to-close-dining-session', (data) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        type: 'request-to-close-dining-session',
        message: `Запрос на закрытие сессий №${data.requestToSession.diningSessionDTO.id} с оплатой ${data.requestToSession.paymentMethodDTO.name}`,
      },
    ])
  })
  usePusherEvent('AsAgyn-channel', 'call-waiter', (data) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { type: 'call-waiter', message: `Вызов оффцианта на стол №${data.clientWait.code}` },
    ])
  })
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])
  const markAsRead = () => {
    setReadNotifications(notifications.map((_, index) => index))
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler></CHeaderToggler>

        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Светлая тема
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Темная тема
              </CDropdownItem>

            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* Notification Dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end" onClick={markAsRead}>
            <CDropdownToggle caret={false} className="position-relative">
              <CIcon icon={cilBell} size="lg" />
              {notifications.length > 0 && notifications.length !== readNotifications.length && (
                <CBadge color="danger" shape="rounded-pill" className="position-absolute top-0 right-0">
                  {notifications.length - readNotifications.length}
                </CBadge>
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              {notifications.length === 0 ? (
                <CDropdownItem disabled>Нет уведомлений</CDropdownItem>
              ) : (
                notifications.map((notification, index) => (
                  <CDropdownItem key={index}>
                    <CIcon className="me-2" icon={notification.type === 'call-waiter' ? cilBell : cilEnvelopeOpen} size="lg" />
                    {notification.message}
                  </CDropdownItem>
                ))
              )}
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
