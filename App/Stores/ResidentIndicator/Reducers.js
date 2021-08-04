/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { ResidentIndicatorTypes } from './Actions'

export const fetchResidentIndicatorLoading = (state) => ({
  ...state,
  data: {},
  isLoading: true,
  errorMessage: null,
})

export const fetchResidentIndicatorSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const fetchResidentIndicatorFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [ResidentIndicatorTypes.FETCH_RESIDENT_INDICATOR_LOADING]: fetchResidentIndicatorLoading,
  [ResidentIndicatorTypes.FETCH_RESIDENT_INDICATOR_SUCCESS]: fetchResidentIndicatorSuccess,
  [ResidentIndicatorTypes.FETCH_RESIDENT_INDICATOR_FAILURE]: fetchResidentIndicatorFailure,
})
