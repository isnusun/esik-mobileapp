/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { ResidentTypes } from './Actions'

export const resetResident = (state) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: null,
})

export const fetchResidentLoading = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
})

export const fetchResidentSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const fetchResidentFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

export const postResidentLoading = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
})

export const postResidentSuccess = (state, { data }) => ({
  ...state,
  isLoading: false,
  errorMessage: null,
})

export const postResidentFailure = (state, { errorMessage }) => ({
  ...state,
  isLoading: false,
  errorMessage: errorMessage,
})
/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [ResidentTypes.RESET_RESIDENT]: resetResident,
  [ResidentTypes.FETCH_RESIDENT_LOADING]: fetchResidentLoading,
  [ResidentTypes.FETCH_RESIDENT_SUCCESS]: fetchResidentSuccess,
  [ResidentTypes.FETCH_RESIDENT_FAILURE]: fetchResidentFailure,
  [ResidentTypes.POST_RESIDENT_LOADING]: postResidentLoading,
  [ResidentTypes.POST_RESIDENT_SUCCESS]: postResidentSuccess,
  [ResidentTypes.POST_RESIDENT_FAILURE]: postResidentFailure,
})
