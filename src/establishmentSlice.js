import { createSlice } from '@reduxjs/toolkit'

const establishmentSlice = createSlice({
  name: 'establishment',
  initialState: {
    data: null,
  },
  reducers: {
    setEstablishment: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { setEstablishment } = establishmentSlice.actions
export default establishmentSlice.reducer
