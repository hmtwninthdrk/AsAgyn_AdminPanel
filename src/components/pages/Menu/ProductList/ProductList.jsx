import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CImage,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash, cilCaretLeft, cilCaretRight } from '@coreui/icons'
import noImage from '../../../../assets/menu/NoImage.jpg'
import { useSelector } from 'react-redux'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [imageUrls, setImageUrls] = useState({})
  const establishment = useSelector((state) => state.establishment.data)
  const itemsPerPage = 20

  const fetchProductsAndImages = async (menuId, searchTerm) => {
    try {
      const productsResponse = await fetch(
        `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/in-menu/${menuId}?query=${searchTerm}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'ngrok-skip-browser-warning': 'true',
          },
        },
      )
      if (!productsResponse.ok) throw new Error('Failed to fetch products')

      const productsData = await productsResponse.json()
      console.log(productsData)
      if(productsData.imageUrl!==""){}
      const imagePromises = productsData.items.map(async (item) => {
        if (item.imageUrl !== "") { // Проверяем imageUrl для каждого элемента
          try {
            const response = await fetch(
              `https://33c9-185-18-253-110.ngrok-free.app${item.imageUrl}`,
              {
                method: 'GET',
                headers: {
                  Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
                  'ngrok-skip-browser-warning': 'true',
                },
              },
            )
            if (!response.ok) throw new Error('Failed to get photo content')
      
            const image = await response.blob()
            const imageUrl = URL.createObjectURL(image)
            return { id: item.id, url: imageUrl }
          } catch (error) {
            console.error('Error getting photo content:', error)
            return { id: item.id, url: '' }
          }
        } else {
          return { id: item.id, url: '' }
        }
      })

      const imageResults = await Promise.all(imagePromises)
      const urls = imageResults.reduce((acc, result) => {
        acc[result.id] = result.url
        return acc
      }, {})

      setImageUrls(urls)
      setProducts(productsData.items)
    } catch (error) {
      console.error('Error fetching products data: ', error)
    }
  }

  useEffect(() => {
    fetchProductsAndImages(establishment.menuDTO.id, searchTerm)
  }, [])

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `https://33c9-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/${id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
          },
        },
      )
      if (!response.ok) throw new Error('Failed to delete the product')
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    } catch (error) {
      console.error('Error deleting product: ', error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
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
    fetchProductsAndImages(establishment.menuDTO.id, value)
  }
  return (
    <div>
      <CRow className="mb-3 justify-content-end">
        <CCol xs="auto">
          <CFormInput
            type="text"
            placeholder="Поиск..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </CCol>
      </CRow>
      <CRow>
        <CTable align="middle" className="mb-4 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Id</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Фото</CTableHeaderCell>
              <CTableHeaderCell>Название</CTableHeaderCell>
              <CTableHeaderCell>Описание</CTableHeaderCell>
              <CTableHeaderCell>Цена</CTableHeaderCell>
              <CTableHeaderCell></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell className="text-center" width={80}>
                  {item.id}
                </CTableDataCell>
                <CTableDataCell className="text-center" width={300}>
                  <CImage
                    rounded
                    fluid
                    thumbnail
                    src={imageUrls[item.id] ? imageUrls[item.id] : noImage} // Используем URL из состояния
                    height={200}
                    width={200}
                  />
                </CTableDataCell>
                <CTableDataCell>{item.nameRu}</CTableDataCell>
                <CTableDataCell>{item.description}</CTableDataCell>
                <CTableDataCell>{item.cost}₸</CTableDataCell>
                <CTableDataCell className="text-center" width={100}>
                  <div className="d-inline-flex gap-2">
                    <Link to={`/menu/editMenu/${item.id}`}>
                      <CButton color="link" className="align-items-center justify-content-center">
                        <CIcon icon={cilPen} className="text-success" size="xl" />
                      </CButton>
                    </Link>
                    <CButton
                      color="link"
                      className="align-items-center justify-content-center"
                      onClick={() => deleteProduct(item.id)}
                    >
                      <CIcon icon={cilTrash} className="text-danger" size="xl" />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <CPagination>
          <CPaginationItem
            disabled={currentPage === 1}
            role="button"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <CIcon icon={cilCaretLeft} />
          </CPaginationItem>
          {renderPagination}
          <CPaginationItem
            disabled={currentPage === pageNumbers.length}
            role="button"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <CIcon icon={cilCaretRight} />
          </CPaginationItem>
        </CPagination>
      </CRow>
    </div>
  )
}

export default ProductList
