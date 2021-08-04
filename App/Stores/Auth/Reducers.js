/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { AuthTypes } from './Actions'

export const loginLoading = (state) => ({
  ...state,
  loginIsLoading: true,
  loginErrorMessage: null,
})

export const loginSuccess = (state, {response}) => ({
  ...state,
  userToken: response.token,
  user: response.user,
  loginIsLoading: false,
  loginErrorMessage: null,
})

export const loginFailure = (state, { errorMessage }) => ({
  ...state,
  userToken: null,
  user: {},
  loginIsLoading: false,
  loginErrorMessage: errorMessage,
})

export const logout = (state) => ({
  ...state,
  userToken: null,
  user: {},
  loginIsLoading: false,
  loginErrorMessage: null,
})

export const getProfileSuccess = (state, {response}) => ({
  ...state,
  user: response.user,
})

export const updateProfileSuccess = (state, {response}) => ({
  ...state,
  user: response.user
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [AuthTypes.LOGIN_LOADING]: loginLoading,
  [AuthTypes.LOGIN_SUCCESS]: loginSuccess,
  [AuthTypes.LOGIN_FAILURE]: loginFailure,
  [AuthTypes.LOGOUT]: logout,
  [AuthTypes.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
})
