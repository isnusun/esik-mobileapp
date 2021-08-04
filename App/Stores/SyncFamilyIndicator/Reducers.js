/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SyncFamilyIndicatorTypes } from './Actions'

export const syncFamilyIndicatorLoading = (state) => ({
  ...state,
  data: {},
  progress: 0,
  isLoading: true,
  errorMessage: null,
})

export const syncFamilyIndicatorProgress = (state, { progress }) => ({
  ...state,
  progress: progress
})

export const syncFamilyIndicatorSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const syncFamilyIndicatorFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SyncFamilyIndicatorTypes.SYNC_FAMILY_INDICATOR_PROGRESS]: syncFamilyIndicatorProgress,
  [SyncFamilyIndicatorTypes.SYNC_FAMILY_INDICATOR_LOADING]: syncFamilyIndicatorLoading,
  [SyncFamilyIndicatorTypes.SYNC_FAMILY_INDICATOR_SUCCESS]: syncFamilyIndicatorSuccess,
  [SyncFamilyIndicatorTypes.SYNC_FAMILY_INDICATOR_FAILURE]: syncFamilyIndicatorFailure,
})
