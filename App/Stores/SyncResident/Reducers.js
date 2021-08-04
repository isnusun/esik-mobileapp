/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SyncResidentTypes } from './Actions'

export const syncResidentLoading = (state) => ({
  ...state,
  data: {},
  progress: 0,
  isLoading: true,
  errorMessage: null,
})

export const syncResidentProgress = (state, { progress }) => ({
  ...state,
  progress: progress
})

export const syncResidentSuccess = (state, { data }) => ({
  ...state,
  data: data,
  isLoading: false,
  errorMessage: null,
})

export const syncResidentFailure = (state, { errorMessage }) => ({
  ...state,
  data: {},
  isLoading: false,
  errorMessage: errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SyncResidentTypes.SYNC_RESIDENT_LOADING]: syncResidentLoading,
  [SyncResidentTypes.SYNC_RESIDENT_PROGRESS]: syncResidentProgress,
  [SyncResidentTypes.SYNC_RESIDENT_SUCCESS]: syncResidentSuccess,
  [SyncResidentTypes.SYNC_RESIDENT_FAILURE]: syncResidentFailure,
})
