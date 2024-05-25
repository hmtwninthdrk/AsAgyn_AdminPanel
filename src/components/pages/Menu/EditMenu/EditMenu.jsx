import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { durationToSeconds, secondsToDuration } from '../../../../helpers/dateFormat'

const EditMenu = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [fileErrorMessage, setFileErrorMessage] = useState('')
  const [product, setProduct] = useState({
    nameRu: '',
    nameEn: '',
    nameKz: '',
    description: '',
    cost: '',
    imageUrl: '',
    minAge: '',
    readyDuration: '',
    startAvailableTime: '',
    endAvailableTime: '',
    categoriesId: '',
    categoriesName: '',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://0d6d-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/${id}`,
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
        console.log(data);
        let cleanStartTime = data.startAvailableTime!==null?data.startAvailableTime.substring(0, data.startAvailableTime.indexOf('+')):'';
        let cleanEndTime = data.endAvailableTime!==null?data.endAvailableTime.substring(0, data.endAvailableTime.indexOf('+')):'';
        setProduct({
          nameRu: data.nameRu,
          nameEn: data.nameEn,
          nameKz: data.nameKz,
          description: data.description,
          cost: data.cost,
          imageUrl: data.imageUrl,
          minAge: data.minAge,
          readyDuration: secondsToDuration(data.readyDuration),
          startAvailableTime: cleanStartTime,
          endAvailableTime: cleanEndTime,
          categoriesId: data.categoryDTOS[0].id,
          categoriesName: data.categoryDTOS[0].name,
        })
        setImageUrl(data.imageUrl) // Установим URL изображения, если есть
        
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [id])
  const handleBackClick = () => {
    navigate(-1)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    const categories = [
      {
        id: product.categoriesId,
        name: product.categoriesName,
      },
    ]
    const updatedMenuItem = {
      categoryDTOS: categories,
      cost: parseFloat(product.cost),
      description: product.description,
      imageUrl: imageUrl,
      nameEn: product.nameEn || product.nameRu,
      nameKz: product.nameKz || product.nameRu,
      nameRu: product.nameRu,
      minAge: product.minAge ? parseInt(product.minAge) : 0,
      readyDuration: durationToSeconds(product.readyDuration),
      startAvailableTime: product.startAvailableTime!==''? product.startAvailableTime.replace(/\+[^+]*$/, '') + ':00+05:00': null,
      endAvailableTime: product.endAvailableTime!==''? product.endAvailableTime.replace(/\+[^+]*$/, '') + ':00+05:00': null,
      errorFields: [],
    }
    console.log(updatedMenuItem)


    try {
      const response = await fetch(
        `https://0d6d-185-18-253-110.ngrok-free.app/demo/admin/api/product-item/${id}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedMenuItem),
        },
      )
      if (!response.ok) throw new Error('Failed to update the product')
        console.log(updatedMenuItem)
      navigate('/menu')
    } catch (error) {
      console.error('Error updating product:', error)
      
    }
  }

  return (
    <>
      <CRow>
        <CCol sm={5}>
          <h4>Редактировать продукт</h4>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="inputTitle">Название</CFormLabel>
              <CFormInput
                required
                type="text"
                placeholder="Название"
                id="inputTitle"
                name="nameRu"
                value={product.nameRu}
                onChange={handleInputChange}
              />
              <CFormInput
                type="text"
                placeholder="Атауы"
                id="inputTitle"
                name="nameKz"
                value={product.nameKz}
                onChange={handleInputChange}
              />
              <CFormInput
                type="text"
                placeholder="Title"
                id="inputTitle"
                name="nameEn"
                value={product.nameEn}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="textAreaDescription">Описание</CFormLabel>
              <CFormTextarea
                required
                id="textAreaDescription"
                rows="3"
                name="description"
                value={product.description}
                onChange={handleInputChange}
              ></CFormTextarea>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputPrice">Цена</CFormLabel>
              <CFormInput
                required
                type="number"
                id="inputPrice"
                name="cost"
                value={product.cost}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputMinAge">Ограничение по возрасту</CFormLabel>
              <CFormInput
                type="number"
                id="inputMinAge"
                name="minAge"
                value={product.minAge}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputReadyDuration">Продолжительность готовности</CFormLabel>
              <CFormSelect
                id="inputReadyDuration"
                name="readyDuration"
                value={product.readyDuration}
                onChange={handleInputChange}
              >
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
                value={product.startAvailableTime}
                onChange={handleInputChange}
                id="inputStartAvailableTime"
                name="startAvailableTime"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="inputEndAvailableTime">Конец доступного времени</CFormLabel>
              <CFormInput
                
                type="datetime-local"
                value={product.endAvailableTime}
                onChange={handleInputChange}
                id="inputEndAvailableTime"
                name="endAvailableTime"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="formFile">Фото</CFormLabel>
              <CFormInput
                onChange={handleFileUpload}
                defaultValue={product.imageUrl}
                type="file"
                id="filePhoto"
                accept="image/*"
                name="image"
              />
              {product.imageUrl===""?'':"* Изображение загружено"}
              {fileErrorMessage}
            </div>
            <CRow>
              <CCol lg={6} className="mb-3 mb-lg-0">
                <CButton type="submit" color="primary" className="w-100">
                  {imageLoading ? 'Загрузка...' : 'Сохранить'}
                </CButton>
              </CCol>
              <CCol lg={6}>
                <CButton color="secondary" className="w-100" onClick={handleBackClick}>
                  Отмена
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
