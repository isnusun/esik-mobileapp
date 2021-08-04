/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { FamilyTypes } from './Actions'

export const resetFamily = (state) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: null,
})

export const fetchFamilyLoading = (state) => ({
  ...state,
  data: {},
  isLoading: true,
  errorMessage: null,
})

export const fetchFamilySuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const fetchFamilyFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

export const postFamilyLoading = (state, { data }) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
})

export const postFamilyFailure = (state, { errorMessage }) => ({
  ...state,
  isLoading: false,
  errorMessage: errorMessage,
})

export const postFamilySuccess = (state, { data }) => ({
  ...state,
  isLoading: false,
  errorMessage: null,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [FamilyTypes.RESET_FAMILY]: resetFamily,
  [FamilyTypes.FETCH_FAMILY_LOADING]: fetchFamilyLoading,
  [FamilyTypes.FETCH_FAMILY_SUCCESS]: fetchFamilySuccess,
  [FamilyTypes.FETCH_FAMILY_FAILURE]: fetchFamilyFailure,
  [FamilyTypes.POST_FAMILY_LOADING]: postFamilyLoading,
  [FamilyTypes.POST_FAMILY_SUCCESS]: postFamilySuccess,
  [FamilyTypes.POST_FAMILY_FAILURE]: postFamilyFailure,
})
