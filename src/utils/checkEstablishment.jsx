import { setEstablishment } from '../establishmentSlice'

export const checkEstablishment = async (dispatch) => {
  try {
    const response = await fetch(
      'https://756c-185-18-253-110.ngrok-free.app/demo/admin/api/establishment',
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
    if (response.ok) {
      const establishmentData = await response.json()
      console.log(establishmentData)
      dispatch(setEstablishment(establishmentData))
    }
  } catch (error) {
    console.error('Ошибка при проверке учреждения:', error)
  }
}
