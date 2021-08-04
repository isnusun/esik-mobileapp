/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SyncRegionTypes } from './Actions'

export const fetchRegionLoading = (state) => ({
  ...state,
  data: {},
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
  [SyncRegionTypes.FETCH_REGION_LOADING]: fetchRegionLoading,
  [SyncRegionTypes.FETCH_REGION_SUCCESS]: fetchRegionSuccess,
  [SyncRegionTypes.FETCH_REGION_FAILURE]: fetchRegionFailure,
})
