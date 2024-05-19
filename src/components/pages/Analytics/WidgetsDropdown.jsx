import React, { useState, useEffect } from 'react'
import { CRow, CCol, CWidgetStatsC } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilMoney, cilPeople } from '@coreui/icons'
import { useSelector } from 'react-redux'

const WidgetsDropdown = () => {
  const [ordersDay, setOrdersDay] = useState({ value: 0, percent: 0 })
  const [ordersMonth, setOrdersMonth] = useState({ value: 0, percent: 0 })
  const [ordersYear, setOrdersYear] = useState({ value: 0, percent: 0 })
  const [incomeDay, setIncomeDay] = useState({ value: 0, percent: 0 })
  const [incomeMonth, setIncomeMonth] = useState({ value: 0, percent: 0 })
  const [incomeYear, setIncomeYear] = useState({ value: 0, percent: 0 })
  const establishment = useSelector((state)=>state.establishment.data)
  const fetchData = async (url, from, to, setData) => {
    try {
      const response = await fetch(
        `${url}?startDate=${formatDateToZoneDateTime(from)}&endDate=${formatDateToZoneDateTime(
          to,
        )}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
          },
        },
      )
      if (!response.ok) throw new Error('Something went wrong')
      const data = await response.json()
      //console.log(data)
      setData(data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const formatDateToZoneDateTime = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const milliseconds = String(date.getMilliseconds()).padStart(6, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
  }

  useEffect(() => {
      var now = new Date()
      var nowLocal = now
      nowLocal.setHours(now.getHours() + now.getTimezoneOffset() / -60)
      var firstDayOfMonth = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), 1, 5, 0, 0)
      var firstDayOfYear = new Date(nowLocal.getFullYear(), 0, 1, 5, 0, 0)
      fetchData(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/order-count-period/${establishment.id}`,
        nowLocal,
        nowLocal,
        setOrdersDay,
      )
      fetchData(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/order-count-period/${establishment.id}`,
        firstDayOfMonth,
        nowLocal,
        setOrdersMonth,
      )
      fetchData(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/order-count-period/${establishment.id}`,
        firstDayOfYear,
        nowLocal,
        setOrdersYear,
      )

      fetchData(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/revenue-period/${establishment.id}`,
        nowLocal,
        nowLocal,
        setIncomeDay,
      )
      fetchData(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/revenue-period/${establishment.id}`,
        firstDayOfMonth,
        nowLocal,
        setIncomeMonth,
      )
      fetchData(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/revenue-period/${establishment.id}`,
        firstDayOfYear,
        nowLocal,
        setIncomeYear,
      )
    
  }, [])

  return (
    <CRow>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilPeople} height={36} />}
          color="primary"
          progress={{ value: Math.abs(ordersDay.percent) }}
          inverse
          title="Orders per day"
          value={
            <>
              {ordersDay.count}{' '}
              <span className="fs-6 fw-normal">
                ({ordersDay.percent}%{' '}
                <CIcon icon={ordersDay.percent < 0 ? cilArrowBottom : cilArrowTop} />)
              </span>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilPeople} height={36} />}
          color="info"
          progress={{ value: Math.abs(ordersMonth.percent) }}
          inverse
          title="Orders per month"
          value={
            <>
              {ordersMonth.count}{' '}
              <span className="fs-6 fw-normal">
                ({ordersMonth.percent}%{' '}
                <CIcon icon={ordersMonth.percent < 0 ? cilArrowBottom : cilArrowTop} />)
              </span>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilPeople} height={36} />}
          color="warning"
          progress={{ value: Math.abs(ordersYear.percent) }}
          inverse
          title="Orders per year"
          value={
            <>
              {ordersYear.count}{' '}
              <span className="fs-6 fw-normal">
                ({ordersYear.percent}%{' '}
                <CIcon icon={ordersYear.percent < 0 ? cilArrowBottom : cilArrowTop} />)
              </span>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilMoney} height={36} />}
          color="secondary"
          progress={{ value: Math.abs(incomeDay.percent) }}
          inverse
          title="Income per day"
          value={
            <>
              {incomeDay.sum}{' '}
              <span className="fs-6 fw-normal">
                ({incomeDay.percent}%{' '}
                <CIcon icon={incomeDay.percent < 0 ? cilArrowBottom : cilArrowTop} />)
              </span>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilMoney} height={36} />}
          color="danger"
          progress={{ value: Math.abs(incomeMonth.percent) }}
          inverse
          title="Income per month"
          value={
            <>
              {incomeMonth.sum}{' '}
              <span className="fs-6 fw-normal">
                ({incomeMonth.percent}%{' '}
                <CIcon icon={incomeMonth.percent < 0 ? cilArrowBottom : cilArrowTop} />)
              </span>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilMoney} height={36} />}
          color="dark"
          progress={{ value: Math.abs(incomeYear.percent) }}
          inverse
          title="Income per year"
          value={
            <>
              {incomeYear.sum}{' '}
              <span className="fs-6 fw-normal">
                ({incomeYear.percent}%{' '}
                <CIcon icon={incomeYear.percent < 0 ? cilArrowBottom : cilArrowTop} />)
              </span>
            </>
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
