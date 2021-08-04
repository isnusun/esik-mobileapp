/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { RegionTypes } from './Actions'

export const fetchRegionLoading = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
})

export const fetchRegionSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const fetchRegionFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [RegionTypes.FETCH_REGION_LOADING]: fetchRegionLoading,
  [RegionTypes.FETCH_REGION_SUCCESS]: fetchRegionSuccess,
  [RegionTypes.FETCH_REGION_FAILURE]: fetchRegionFailure,
})
