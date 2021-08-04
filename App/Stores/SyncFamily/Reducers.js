/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SyncFamilyTypes } from './Actions'

export const syncFamilyLoading = (state) => ({
  ...state,
  data: {},
  progress: 0,
  isLoading: true,
  errorMessage: null,
})

export const syncFamilyProgress = (state, { progress }) => ({
  ...state,
  progress: progress
})

export const syncFamilySuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const syncFamilyFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SyncFamilyTypes.SYNC_FAMILY_LOADING]: syncFamilyLoading,
  [SyncFamilyTypes.SYNC_FAMILY_PROGRESS]: syncFamilyProgress,
  [SyncFamilyTypes.SYNC_FAMILY_SUCCESS]: syncFamilySuccess,
  [SyncFamilyTypes.SYNC_FAMILY_FAILURE]: syncFamilyFailure,
})
