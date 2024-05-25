import { configureStore } from '@reduxjs/toolkit'
import establishmentReducer from './establishmentSlice'

const sessionStorageMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action)
  const state = storeAPI.getState()
  sessionStorage.setItem('reduxState', JSON.stringify(state))
  return result
}
const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('reduxState')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Не удалось загрузить состояние из session storage', err)
    return undefined
  }
}
const preloadedState = loadState()
const store = configureStore({
  reducer: {
    establishment: establishmentReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sessionStorageMiddleware),
  preloadedState,
})

export default store
