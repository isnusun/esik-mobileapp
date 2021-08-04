/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SyncTypes } from './Actions'

export const syncLoading = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
  isFamilyDone: false,
  isResidentDone: false,
  isFamilyIndicatorDone: false,
  isResidentIndicatorDone: false,
})

export const syncSuccess = (state) => ({
  ...state,
  isLoading: false,
  errorMessage: null,
})

export const syncFailure = (state, { errorMessage }) => ({
  ...state,
  isLoading: false,
  errorMessage: errorMessage,
})

export const syncFamilyDone = (state) => ({
  ...state,
  isFamilyDone: true,
})

export const syncResidentDone = (state) => ({
  ...state,
  isResidentDone: true,
})

export const syncFamilyIndicatorDone = (state) => ({
  ...state,
  isFamilyIndicatorDone: true,
})

export const syncResidentIndicatorDone = (state) => ({
  ...state,
  isResidentIndicatorDone: true,
})
/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SyncTypes.SYNC_LOADING]: syncLoading,
  [SyncTypes.SYNC_SUCCESS]: syncSuccess,
  [SyncTypes.SYNC_FAILURE]: syncFailure,
  [SyncTypes.SYNC_RESIDENT_DONE]: syncResidentDone,
  [SyncTypes.SYNC_FAMILY_DONE]: syncFamilyDone,
  [SyncTypes.SYNC_RESIDENT_INDICATOR_DONE]: syncResidentIndicatorDone,
  [SyncTypes.SYNC_FAMILY_INDICATOR_DONE]: syncFamilyIndicatorDone,
})
