import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {},
  reducers: {
    updateApp: (state, action) => {
      state.gymForm = action.payload
    },
    updateStatus: (state, action) => {
      const { isValid, isDirty } = action.payload
      state.isGymFormValid = isValid
      state.isGymFormDirty = isDirty
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateApp, updateStatus } = appSlice.actions

export default appSlice.reducer
