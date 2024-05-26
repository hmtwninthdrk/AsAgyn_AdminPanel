import React, { useState, useEffect } from 'react'

import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import WidgetsDropdown from './WidgetsDropdown'
import { useSelector } from 'react-redux'

const Analytics = () => {
  const establishment = useSelector((state)=>state.establishment.data)
  const [january, setJanuary] = useState({ value: 0 })
  const [february, setFebruary] = useState({ value: 0 })
  const [march, setMarch] = useState({ value: 0 })
  const [april, setApril] = useState({ value: 0 })
  const [may, setMay] = useState({ value: 0 })
  const [june, setJune] = useState({ value: 0 })
  const [july, setJuly] = useState({ value: 0 })
  const [august, setAugust] = useState({ value: 0 })
  const [september, setSeptember] = useState({ value: 0 })
  const [october, setOctober] = useState({ value: 0 })
  const [november, setNovember] = useState({ value: 0 })
  const [december, setDecember] = useState({ value: 0 })


  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!response.ok) throw new Error('Something went wrong')

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching data: ', error)
      return {}
    }
  }

  useEffect(() => {    
      fetchData(
        `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/establishment/revenue-every-month-period/${establishment.id}`,
      ).then((data) => {
        setJanuary({ value: data.JANUARY || 0 })
        setFebruary({ value: data.FEBRUARY || 0 })
        setMarch({ value: data.MARCH || 0 })
        setApril({ value: data.APRIL || 0 })
        setMay({ value: data.MAY || 0 })
        setJune({ value: data.JUNE || 0 })
        setJuly({ value: data.JULY || 0 })
        setAugust({ value: data.AUGUST || 0 })
        setSeptember({ value: data.SEPTEMBER || 0 })
        setOctober({ value: data.OCTOBER || 0 })
        setNovember({ value: data.NOVEMBER || 0 })
        setDecember({ value: data.DECEMBER || 0 })
      })
    
  }, [])
  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Доход
              </h4>
             
            </CCol>
          </CRow>
          <CChartBar
            data={{
              labels: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь',
              ],
              datasets: [
                {
                  label: 'Income',
                  backgroundColor: '#3399ff',
                  data: [
                    january.value,
                    february.value,
                    march.value,
                    april.value,
                    may.value,
                    june.value,
                    july.value,
                    august.value,
                    september.value,
                    october.value,
                    november.value,
                    december.value,
                  ],
                },
              ],
            }}
            labels="months"
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Analytics