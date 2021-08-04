import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  startSync: ['userid', 'userToken'],
  syncFamilyDone: null,
  syncResidentDone: null,
  syncFamilyIndicatorDone: null,
  syncResidentIndicatorDone: null,
  syncLoading: null,
  syncSuccess: null,
  syncFailure: null,
  stopSync: null,
})

export const SyncTypes = Types
export default Creators
