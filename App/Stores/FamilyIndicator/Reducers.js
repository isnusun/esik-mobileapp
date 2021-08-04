/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { FamilyIndicatorTypes } from './Actions'

export const fetchFamilyIndicatorLoading = (state) => ({
  ...state,
  data: {},
  isLoading: true,
  errorMessage: null,
})

export const fetchFamilyIndicatorSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const fetchFamilyIndicatorFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [FamilyIndicatorTypes.FETCH_FAMILY_INDICATOR_LOADING]: fetchFamilyIndicatorLoading,
  [FamilyIndicatorTypes.FETCH_FAMILY_INDICATOR_SUCCESS]: fetchFamilyIndicatorSuccess,
  [FamilyIndicatorTypes.FETCH_FAMILY_INDICATOR_FAILURE]: fetchFamilyIndicatorFailure,
})
