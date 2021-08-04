/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SyncResidentIndicatorTypes } from './Actions'

export const syncResidentIndicatorLoading = (state) => ({
  ...state,
  data: {},
  progress: 0,
  isLoading: true,
  errorMessage: null,
})

export const syncResidentIndicatorProgress = (state, { progress }) => ({
  ...state,
  progress: progress
})

export const syncResidentIndicatorSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const syncResidentIndicatorFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SyncResidentIndicatorTypes.SYNC_RESIDENT_INDICATOR_PROGRESS]: syncResidentIndicatorProgress,
  [SyncResidentIndicatorTypes.SYNC_RESIDENT_INDICATOR_LOADING]: syncResidentIndicatorLoading,
  [SyncResidentIndicatorTypes.SYNC_RESIDENT_INDICATOR_SUCCESS]: syncResidentIndicatorSuccess,
  [SyncResidentIndicatorTypes.SYNC_RESIDENT_INDICATOR_FAILURE]: syncResidentIndicatorFailure,
})
