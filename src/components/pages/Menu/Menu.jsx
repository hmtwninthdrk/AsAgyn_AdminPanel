import React from 'react'

import { Link } from 'react-router-dom'
import { CButton, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import ProductList from './ProductList/ProductList'

const Menu = () => {
  return (
    <>
      <CRow>
        <CCol sm={5}>
          <h4 id="traffic" className="card-title mb-3">
            Menu
          </h4>
          <Link to="/menu/addMenu">
            <CButton color="primary" className="mb-3">
              <CIcon icon={cilPlus} className="me-2" />
              Add New Item
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <ProductList/>
    </>
  )
}

export default Menu
