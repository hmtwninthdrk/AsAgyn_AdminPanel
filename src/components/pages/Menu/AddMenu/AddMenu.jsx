import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CButton,
  CFormSelect,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { durationToSeconds } from '../../../../helpers/dateFormat'

const AddMenu = () => {
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [categorieList, setcategoryList] = useState([])
  const [fileErrorMessage, setFileErrorMessage] = useState('')
  const navigate = useNavigate()
  const establishment = useSelector((state) => state.establishment.data)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://0d6d-185-18-253-110.ngrok-free.app/demo/mobile/api/categories',
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
          console.log(data)
          setcategoryList(data)
        } else {
          throw new Error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories methods:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleBackClick = () => {
    window.history.back()
  }

  const OnSubmitProducts = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    const categories = [
      {
        id: formData.get('categoryId'),
        name: event.target
          .querySelector(`[value="${formData.get('categoryId')}"]`)
          .getAttribute('data-category-name'),
      },
    ]
    const newMenuItem = {
      categoryDTOS: categories,
      cost: parseFloat(formData.get('price')),
      description: formData.get('description'),
      imageUrl: imageUrl,
      nameEn: !formData.get('nameEn') ? formData.get('nameRu') : formData.get('nameEn'),
      nameKz: !formData.get('nameKz') ? formData.get('nameRu') : formData.get('nameKz'),
      nameRu: formData.get('nameRu'),
      minAge: formData.get('minAge') ? formData.get('minAge') : 0,
      readyDuration: durationToSeconds(formData.get('readyDuration')),
      startAvailableTime: formData.get('startAvailableTime')
        ? formData.get('startAvailableTime') + ':00+05:00'
        : null,
      endAvailableTime: formData.get('endAvailableTime')
        ? formData.get('endAvailableTime') + ':00+05:00'
        : null,
      errorFields: [],
    }
    try {
      console.log(newMenuItem)
      const response = await fetch(
        `https://0d6d-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/in-menu/${establishment.menuDTO.id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'Accept-Language': 'ru-RU',
          },
          body: JSON.stringify(newMenuItem),
        },
      )
      if (response.ok) {
        navigate('/menu')
        console.log(newMenuItem)
      } else {
        throw new Error('Something went wrong with the POST request')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        setFileErrorMessage('Файл слишком большой. Максимальный размер файла - 1 МБ.')
        event.target.value = null
        return
      }
      try {
        setFileErrorMessage('')
        setImageLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
          'https://0d6d-185-18-253-110.ngrok-free.app/demo/api/photo/upload-photo',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
              'Accept-Language': 'ru-RU',
            },
            body: formData,
          },
        )

        if (response.ok) {
          const responseData = await response.json()
          console.log(responseData)
          setImageUrl(responseData.url)
        } else {
          throw new Error('Failed to upload file')
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      } finally {
        setImageLoading(false)
      }
    }
  }

  return (
    <CRow>
      <CCol sm={5}>
        <h4 id="traffic" className="card-title mb-3">
          Добавить новый продукт
        </h4>
        <CForm onSubmit={OnSubmitProducts}>
          <div className="mb-3">
            <CFormLabel htmlFor="inputTitle">Название</CFormLabel>
            <CFormInput required type="text" placeholder="Название" id="inputTitle" name="nameRu" />
            <CFormInput type="text" placeholder="Атауы" id="inputTitle" name="nameKz" />
            <CFormInput type="text" placeholder="Title" id="inputTitle" name="nameEn" />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="inputCategory">Категория</CFormLabel>
            <CFormSelect id="inputCategory" name="categoryId">
              {categorieList.map((category) => (
                <option key={category.id} value={category.id} data-category-name={category.name}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="textAreaDescription">Описание</CFormLabel>
            <CFormTextarea
              required
              id="textAreaDescription"
              rows="3"
              name="description"
            ></CFormTextarea>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="inputPrice">Цена</CFormLabel>
            <CFormInput required type="number" id="inputPrice" name="price" />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="inputMinAge">Ограничение по возрасту</CFormLabel>
            <CFormInput type="number" id="inputMinAge" name="minAge" />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="inputReadyDuration">Продолжительность готовности</CFormLabel>
            <CFormSelect required id="inputReadyDuration" name="readyDuration">
              <option value="1 мин">1 мин</option>
              <option value="5 мин">5 мин</option>
              <option value="10 мин">10 мин</option>
              <option value="15 мин">15 мин</option>
              <option value="30 мин">30 мин</option>
              <option value="45 мин">45 мин</option>
              <option value="1 час">1 час</option>
              <option value="1 час 30 мин">1 час 30 мин</option>
              <option value="2 часа">2 часа</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="inputStartAvailableTime">Начальное доступное время</CFormLabel>
            <CFormInput
              type="datetime-local"
              id="inputStartAvailableTime"
              name="startAvailableTime"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="inputEndAvailableTime">Конец доступного времени</CFormLabel>
            <CFormInput type="datetime-local" id="inputEndAvailableTime" name="endAvailableTime" />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="filePhoto">Фото</CFormLabel>
            <CFormInput
              onChange={handleFileUpload}
              type="file"
              id="filePhoto"
              accept="image/*"
              name="image"
            />
            {fileErrorMessage}
          </div>
          <CRow>
            <CCol lg={6} className="mb-3 mb-lg-0">
              <CButton type="submit" color="primary" className="w-100">
                {imageLoading ? 'Загрузка...' : 'Добавить'}
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
  )
}

export default AddMenu
