import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CCol, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CButton } from '@coreui/react'

const EditMenu = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({
    nameRu: '',
    nameEn: '',
    nameKz: '',
    description: '',
    cost: '',
    image: '',
    minAge: '',
    readyDuration: '',
    categoriesId: '',
    categoriesName: '',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/${id}`,
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
        setProduct({
          nameRu: data.nameRu,
          nameEn: data.nameEn,
          nameKz: data.nameKz,
          description: data.description,
          cost: data.cost,
          minAge: data.minAge,
          readyDuration: data.readyDuration,
          categoriesId: data.categoryDTOS[0].id,
          categoriesName: data.categoryDTOS[0].name,
        })
        console.log(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [id])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const categories = [
      {
        id: product.categoriesId,
        name: product.categoriesName,
      },
    ]
    const newMenuItem = {
      categories: categories,
      cost: parseFloat(formData.get('price')),
      description: formData.get('description'),
      imageUrl: '',
      nameEn: !formData.get('nameEn') ? formData.get('nameRu') : formData.get('nameEn'),
      nameKz: !formData.get('nameKz') ? formData.get('nameRu') : formData.get('nameKz'),
      nameRu: formData.get('nameRu'),
      minAge: formData.get('minAge') ? formData.get('minAge') : 0,
      readyDuration: formData.get('readyDuration'),
      startAvailableTime: 0,
      endAvailableTime: 0,
      errorFields: [],
    }

    try {
      const response = await fetch(
        `https://86c1-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/${id}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMenuItem),
        },
      )
      if (!response.ok) throw new Error('Failed to update the product')

      navigate('/menu')
    } catch (error) {
      console.error('Error updating product:', error)
      console.log(newMenuItem)
    }
  }

  return (
    <>
      <CRow>
        <CCol sm={5}>
          <h4>Edit menu item</h4>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="inputTitle">Title</CFormLabel>

              <CFormInput
                required
                type="text"
                placeholder="Название"
                id="inputTitle"
                name="nameRu"
                defaultValue={product.nameRu}
              />
              <CFormInput
                type="text"
                placeholder="Атауы"
                id="inputTitle"
                name="nameKz"
                defaultValue={product.nameKz}
              />
              <CFormInput
                type="text"
                placeholder="Title"
                id="inputTitle"
                name="nameEn"
                defaultValue={product.nameEn}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="textAreaDescription">Description</CFormLabel>
              <CFormTextarea
                required
                id="textAreaDescription"
                rows="3"
                name="description"
                defaultValue={product.description}
              ></CFormTextarea>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputPrice">Price</CFormLabel>
              <CFormInput
                required
                type="number"
                id="inputPrice"
                name="price"
                defaultValue={product.cost}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputMinAge">Min Age</CFormLabel>
              <CFormInput
                type="number"
                id="inputMinAge"
                name="minAge"
                defaultValue={product.minAge}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputReadyDuration">Ready Duration</CFormLabel>
              <CFormInput
                required
                type="number"
                id="inputReadyDuration"
                defaultValue={product.readyDuration}
                name="readyDuration"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="formFile">New photo</CFormLabel>
              <CFormInput type="file" id="filePhoto" accept="image/*" name="image" />
            </div>
            <CRow>
              <CCol lg={6} className="mb-3 mb-lg-0">
                <CButton type="submit" color="primary" className="w-100">
                  Edit
                </CButton>
              </CCol>
              <CCol lg={6}>
                <CButton color="secondary" className="w-100" onClick={handleBackClick}>
                  Cancel
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCol>
      </CRow>
    </>
  )
}

export default EditMenu
