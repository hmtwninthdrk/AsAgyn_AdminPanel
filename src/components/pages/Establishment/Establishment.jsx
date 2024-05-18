import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilInstitution, cilRestaurant } from '@coreui/icons'

const Establishment = () => {
  const [establishmentName, setEstablishmentName] = useState('')
  const [servingPercentage, setServingPercentage] = useState('')
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([])

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          'https://756c-185-18-253-110.ngrok-free.app/demo/admin/api/payment-method',
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
              'ngrok-skip-browser-warning': 'true',
              'Accept-Language': 'ru-RU',
            },
          },
        )
        if (response.ok) {
          const data = await response.json()
          setPaymentMethods(data)
        } else {
          throw new Error('Failed to fetch payment methods')
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error)
      }
    }

    fetchPaymentMethods()
  }, [])

  const handleCheckboxChange = (id) => {
    setSelectedPaymentMethods((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((methodId) => methodId !== id)
      } else {
        return [...prevSelected, id]
      }
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    
    const selectedMethods = paymentMethods.filter(method => selectedPaymentMethods.includes(method.id));
    
    const newEstablishment = {
      backgroundImage: '',
      establishmentName: establishmentName,
      servingPercentage: servingPercentage,
      paymentMethods: selectedMethods.map(method => ({ id: method.id, name: method.name }))
    };
    
    console.log(newEstablishment);
    
    try {
      const establishmentResponse = await fetch(
        'https://756c-185-18-253-110.ngrok-free.app/demo/admin/api/establishment',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify(newEstablishment),
        }
      );
      if (establishmentResponse.ok) {
        const newEstablishmentData = await establishmentResponse.json();
        const establishmentId = newEstablishmentData.id;
        console.log(establishmentId);
        console.log(newEstablishmentData);
      } else {
        throw new Error('Failed to create Establishment');
      }
    } catch (error) {
      console.error('Error creating establishment or menu:', error);
    }
  };
  

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>Настройте свое заведение</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilInstitution} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Название вашего заведения"
                        value={establishmentName}
                        onChange={(e) => setEstablishmentName(e.target.value)}
                        autoComplete="establishmentName"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilRestaurant} />
                      </CInputGroupText>
                      <CFormInput
                        type="number"
                        value={servingPercentage}
                        onChange={(e) => setServingPercentage(e.target.value)}
                        placeholder="Процент за обслуживание"
                        autoComplete="servingPercentage"
                      />
                    </CInputGroup>
                    <p>Виды оплаты которые будете принимать</p>
                    {paymentMethods.map((method) => (
                      <CFormCheck
                        key={method.id}
                        type="checkbox"
                        id={`method-${method.id}`}
                        label={method.name}
                        value={method.id}
                        onChange={() => handleCheckboxChange(method.id)}
                        checked={selectedPaymentMethods.includes(method.id)}
                      />
                    ))}
                    <br />
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Создать
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Establishment
