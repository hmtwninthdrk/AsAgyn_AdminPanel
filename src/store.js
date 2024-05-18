import { configureStore } from '@reduxjs/toolkit'
import establishmentReducer from './establishmentSlice'

const store = configureStore({
  reducer: {
    establishment: establishmentReducer,
  },
})

export default store
