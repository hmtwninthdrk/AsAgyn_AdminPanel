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
  const dispatch = useDispatch()
  const authorization = async (e) => {
    e.preventDefault()

    const user = {
      username: login,
      password: password,
    }
    try {
      const response = await fetch(
        'https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify(user),
        },
      )

      if (!response.ok) throw new Error('Something went wrong with the POST request')

      const data = await response.json()
      console.log(data)
      sessionStorage.setItem('accessToken', data.token)
      const establishmentResponse = await fetch(
        'https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/establishment',
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
      console.log(establishmentData)
      if (establishmentData) {
        dispatch(setEstablishment(establishmentData))
        navigate('/')
      } else {
        navigate('/establishment')
      }
    } catch (error) {
      navigate('/establishment')
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
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
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
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
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
