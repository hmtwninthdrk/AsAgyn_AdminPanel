import React, { useEffect, useState } from 'react'
import {
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CButton,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretLeft, cilCaretRight } from '@coreui/icons'
import pusherJs from 'pusher-js'
import { useSelector } from 'react-redux'
import usePusherEvent from '../../Pusher/usePusherSubscription'
import { usePusher } from '../../Pusher/PusherProvider'

const Orders = () => {
  const [allOpenSessions, setAllOpenSessions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const establishment = useSelector((state) => state.establishment.data)
  const pusher = usePusher();
  const itemsPerPage = 20
  usePusherEvent('AsAgyn-channel', 'dining-session-create-event', (data) => {
    setAllOpenSessions((prevSessions) => [...prevSessions, data])
  })
  usePusherEvent('AsAgyn-channel', 'order-create-event', (data) => {
    setAllOpenSessions(prevSessions => prevSessions.map(session => {
      if (session.id === data.order.diningSessionDTO.id) {
        return {
          ...session,
          orders: [...session.orders, data.order]
        };
      }
      return session;
    }));
  });

  usePusherEvent('AsAgyn-channel', 'request-to-close-dining-session', (data) => {
    console.log(data);
  })
  usePusherEvent('AsAgyn-channel', 'call-waiter', (data) => {
    console.log(data);
  })

  useEffect(() => {
    const getAllSessions = async () => {
      try {
        const response = await fetch(
          `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/dining-session/all-session/${establishment.id}?page=${currentPage}&limit=${itemsPerPage}`,
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
        if (response.ok) {
          const data = await response.json()
          const sessionsWithOrders = await Promise.all(
            data.map(async (session) => {
              const orderResponse = await fetch(
                `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/order/by-session/${session.id}`,
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
              if (ordersData !== null) {
                return {
                  ...session,
                  orders: ordersData,
                }
              }
              return {
                ...session,
                orders: [],
              }
            }),
          )
          setAllOpenSessions(sessionsWithOrders)
        } else {
          throw new Error('Failed to fetch sessions')
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      }
    }

    getAllSessions()
  }, [])

  const updateOrderStatus = async (order, orderId, newStatus) => {
    try {
      const response = await fetch(
        `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/order/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify({ ...order, orderStatus: newStatus }),
        },
      )
      if (!response.ok) {
        throw new Error('Failed to update order status')
      }
      const updatedOrder = await response.json()
      setAllOpenSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === order.diningSessionDTO.id
            ? {
                ...session,
                orders: session.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
              }
            : session,
        ),
      )
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleCloseSession = async (session, sessionId) => {
    try {
      const response = await fetch(
        `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/dining-session/close-session/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify({ ...session, close: true }),
        },
      )
      if (!response.ok) {
        throw new Error('Failed to close session')
      }
      setAllOpenSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId))
    } catch (error) {
      console.error('Error closing session:', error)
    }
  }

  const calculateTotal = (order) => {
    let total = 0;
    order.orderItemDTOS.forEach((orderItem) => {
      total += orderItem.cost * orderItem.quantity;
    });
    return total;
  };

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(allOpenSessions.length / itemsPerPage); i++) {
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

  return (
    <div>
      {allOpenSessions &&
        allOpenSessions.map((session, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #000',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
              Открытая сессия №{session.id}
              <CButton onClick={() => handleCloseSession(session, session.id)} color="danger">
                Закрыть сессию
              </CButton>
            </div>
            <div>
              {session.orders && session.orders.length > 0 ? (
                session.orders.map((order, orderIndex) => (
                  <CAccordion key={orderIndex} flush>
                    <CAccordionItem>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
                        Заказ № {order.id}
                        <CFormSelect
                          style={{ width: '50%' }}
                          value={order.orderStatus}
                          onChange={(e) => {
                            updateOrderStatus(order, order.id, e.target.value)
                          }}
                          aria-label="Status"
                          options={[
                            { label: 'В процессе', value: 'Processing' },
                            { label: 'Готовиться', value: 'Cooking' },
                            { label: 'Подается', value: 'Serving' },
                            { label: 'Подан', value: 'Served' },
                            { label: 'Оплачен', value: 'Payed' },
                            { label: 'Отменен', value: 'Cancelled' },
                          ]}
                        />
                        <CAccordionHeader />
                      </div>
                      <CAccordionBody>
                        <CTable align="middle" className="mb-4 border" hover responsive>
                          <CTableHead color="light">
                            <CTableRow>
                              <CTableHeaderCell className="text-center">Название</CTableHeaderCell>
                              <CTableHeaderCell>Количество</CTableHeaderCell>
                              <CTableHeaderCell>Описание</CTableHeaderCell>
                              <CTableHeaderCell>Цена</CTableHeaderCell>
                              <CTableHeaderCell>Общая цена</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {order.orderItemDTOS.map((orderItem) => (
                              
                              <CTableRow key={orderItem.id}>
                                <CTableDataCell className="text-center">
                                  {orderItem.title}
                                </CTableDataCell>
                                <CTableDataCell>{orderItem.quantity}</CTableDataCell>
                                <CTableDataCell>{orderItem.description}</CTableDataCell>
                                <CTableDataCell>{orderItem.cost} ₸</CTableDataCell>
                                <CTableDataCell>{orderItem.cost * orderItem.quantity} ₸</CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                        <div>Итого:{calculateTotal(order)} ₸</div>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                ))
              ) : (
                <div>Нет заказов</div>
              )}
            </div>
          </div>
        ))}
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
