import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setEstablishment } from '../../../establishmentSlice'

const Login = () => {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  const dispatch = useDispatch()
  const authorization = async (e) => {
    e.preventDefault()

    const user = {
      username: login,
      password: password,
    }
    try {
      const response = await fetch(
        'https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify(user),
        },
      )

      if (!response.ok){
        if (response.status === 401) {
          setError('Неправильное имя пользователя или пароль');
        }
        else{
          setError("Что-то пошло не так. Пожалуйста, попробуйте еще раз.");
        }
      }

      const data = await response.json()
      sessionStorage.setItem('accessToken', data.token)
      const establishmentResponse = await fetch(
        'https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/establishment',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
          },
        },
      )

      if (!establishmentResponse.ok) throw new Error('Something went wrong with the GET request')
      const establishmentData = await establishmentResponse.json()

      if (establishmentData.hasErrors===false) {
        dispatch(setEstablishment(establishmentData.object))
        navigate('/')
      } else {
        navigate('/establishment')
      }
    } catch (error) {

    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={authorization}>
                    <h1>Войти</h1>
                    <p className="text-medium-emphasis">Войдите в свою учетную запись</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Имя пользователя"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    {error && <p className="text-danger">{error}</p>}
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Войти
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

export default Login
