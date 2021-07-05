/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  isAuth: false,
  error: '',
}

const loginReducer = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state) => {
      state.isLoading = false
      state.isAuth = true
      state.error = ''
    },
    loginFail: (state, { payload }) => {
      state.isLoading = false
      state.error = payload
    },
  },
})

const { reducer, actions } = loginReducer

export const { loginPending, loginSuccess, loginFail } = actions

export default reducer
