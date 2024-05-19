import React, { useEffect, useState } from 'react'
import {
  CFormSelect,
  CTable,
  CRow,
  CCol,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormInput,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretLeft, cilCaretRight } from '@coreui/icons'
import pusherJs from 'pusher-js'
import { useSelector } from 'react-redux'

const Orders = () => {
  const [sessions, setSessions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const establishment = useSelector((state) => state.establishment.data)
  const itemsPerPage = 20

  useEffect(() => {
    const pusher = new pusherJs('1b1aac5f3ed531c5e179', {
      cluster: 'ap2',
    })
    const channel = pusher.subscribe('AsAgyn-channel')
    channel.bind('dining-session-create-event', function (data) {
      console.log('Session created:', data)
      setSessions((prevSessions) => {
        // Проверка, есть ли уже в массиве сессия с таким же id
        const sessionExists = prevSessions.some((session) => session.id === data.id)
        if (!sessionExists) {
          // Если такой сессии еще нет, добавляем новую сессию к массиву
          return [...prevSessions, data]
        } else {
          // Если сессия с таким id уже существует, возвращаем предыдущее состояние
          return prevSessions
        }
      })
      fetchSessions()
    })

    channel.bind('order-create-event', function (data) {
      console.log('Order created:', data)
      const updatedSessions = sessions.map((session) => {
        if (session.id === data.order.diningSessionDTO.id) {
          //data.diningSessionDTO.id?
          return {
            ...session,
            orders: Array.isArray(session.orders) ? [...session.orders, data.order] : [data.order],
          }
        }
        return session
      })
      setSessions(updatedSessions)
    })

    channel.bind('call-waiter', function (data) {
      console.log('Session created:', data)
      alert(data)
    })

    console.log('Pusher connected successfully!')
    return () => {
      pusher.unsubscribe('AsAgyn-channel')
    }
  }, [sessions])

  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/dining-session/all-session/${establishment.id}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
            'Accept-Language': 'ru-RU',
          },
        },
      )
      if (!response.ok) throw new Error('Something went wrong')

      const data = await response.json()
      console.log(data)

      const sessionsWithOrders = await Promise.all(
        data.map(async (session) => {
          const orderResponse = await fetch(
            `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/dining-session/${session.id}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
                'ngrok-skip-browser-warning': 'true',
                'Accept-Language': 'ru-RU',
              },
            },
          )
          if (!orderResponse.ok) throw new Error('Failed to fetch orders for session')

          const ordersData = await orderResponse.json()
          console.log(ordersData)
          return {
            ...session,
            orders: ordersData,
          }
        }),
      )

      setSessions(sessionsWithOrders)
    } catch (error) {
      console.error('Error fetching sessions: ', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      fetchSessions()
    }

    fetchData()
  }, [])

  const updateOrderStatus = async (sessionId, orderId, newStatus) => {
    try {
      // Находим заказ в текущем состоянии
      const sessionToUpdate = sessions.find((session) => session.id === sessionId)
      if (!sessionToUpdate) return
      const updatedOrders = [...sessionToUpdate.orders] // Создаем копию массива заказов

      const orderIndex = updatedOrders.findIndex((order) => order.id === orderId) // Находим индекс нужного заказа

      if (orderIndex !== -1) {
        updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], orderStatus: newStatus } // Обновляем статус нужного заказа
      }

      console.log(updatedOrders[orderIndex])

      const response = await fetch(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/order/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify(updatedOrders[orderIndex]),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setSessions((prevSessions) => {
        const updatedSessions = prevSessions.map((session) => {
          if (session.id === sessionId) {
            return { ...session, orders: updatedOrders }
          }
          return session
        })
        return updatedSessions
      })
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleCloseSession = async (sessionId) => {
    const sessionToUpdate = sessions.find((session) => session.id === sessionId)
    try {
      const response = await fetch(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/dining-session/close-session/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify({ ...sessionToUpdate, close: true }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to close session')
      }

      // Если сессия успешно закрыта, вызываем функцию для загрузки данных
      fetchSessions()
    } catch (error) {
      console.error('Error closing session:', error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sessions.slice(indexOfFirstItem, indexOfLastItem)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(sessions.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const renderPagination = pageNumbers.map((number) => (
    <CPaginationItem
      key={number}
      active={number === currentPage}
      role="button"
      onClick={() => setCurrentPage(number)}
    >
      {number}
    </CPaginationItem>
  ))

  const handleSearchChange = (event) => {
    const value = event.target.value
    setCurrentPage(1)
    setSearchTerm(value)
  }

  console.log(currentItems);
  return (
    <div>
      <CRow className="mb-3 justify-content-end">
        <CCol xs="auto">
          <CFormInput
            type="text"
            placeholder="Search..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </CCol>
      </CRow>
      <CTable align="middle" className="mb-4 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center">Table</CTableHeaderCell>
            <CTableHeaderCell>Created on</CTableHeaderCell>
            <CTableHeaderCell>Session</CTableHeaderCell>
            <CTableHeaderCell>Menu Items</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Quantity</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Total</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item, index) => (
            <CTableRow key={index}>
              <CTableDataCell className="text-center">
                <div>{item.id}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.startDateTime}</div>
              </CTableDataCell>
              <CTableDataCell>
                <CButton onClick={() => handleCloseSession(item.id)}>Закрыть сессию</CButton>
              </CTableDataCell>
              <CTableDataCell>
                {item.orders &&
                  item.orders.map((menu) => (
                    <div key={menu.id}>
                      {menu.orderItemDTOS.map((order) => (
                        <div key={order.id}>
                          #{order.id} {order.title}
                        </div>
                      ))}
                    </div>
                  ))}
              </CTableDataCell>
              <CTableDataCell>
                {item.orders &&
                  item.orders.map((menu) => (
                    <div key={menu.id}>
                      <CFormSelect
                        aria-label="Status"
                        value={menu.orderStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value
                          updateOrderStatus(item.id, menu.id, newStatus)
                        }}
                        options={[
                          { label: 'Processing', value: 'Processing' },
                          { label: 'Cooking', value: 'Cooking' },
                          { label: 'Serving', value: 'Serving' },
                          { label: 'Served', value: 'Served' },
                          { label: 'Payed', value: 'Payed' },
                          { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                      />
                    </div>
                  ))}
              </CTableDataCell>
              <CTableDataCell>
                {item.orders &&
                  item.orders.map((menu) => (
                    <div key={menu.id}>
                      {menu.orderItemDTOS.map((order) => (
                        <div key={order.id}>{order.quantity}</div>
                      ))}
                    </div>
                  ))}
              </CTableDataCell>
              <CTableDataCell>
                {item.orders &&
                  item.orders.map((menu) => (
                    <div key={menu.id}>
                      {menu.orderItemDTOS.map((order) => (
                        <div key={order.id}>{order.description}</div>
                      ))}
                    </div>
                  ))}
              </CTableDataCell>
              <CTableDataCell>
                {item.orders &&
                  item.orders.map((menu) => (
                    <div key={menu.id}>
                      {menu.orderItemDTOS.map((order) => (
                        <div key={order.id}>{order.cost}</div>
                      ))}
                    </div>
                  ))}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CPagination aria-label="Page navigation example">
        <CPaginationItem
          aria-label="Previous"
          disabled={currentPage === 1}
          role="button"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <CIcon icon={cilCaretLeft} size="sm" />
        </CPaginationItem>
        {renderPagination}
        <CPaginationItem
          aria-label="Next"
          disabled={currentPage === pageNumbers.length}
          role="button"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <CIcon icon={cilCaretRight} size="sm" />
        </CPaginationItem>
      </CPagination>
    </div>
  )
}

export default Orders
