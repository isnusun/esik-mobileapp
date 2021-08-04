import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  syncFamily: ['userid', 'userToken'],
  syncFamilyProgress: ['progress'],
  syncFamilyLoading: null,
  syncFamilySuccess: ['data'],
  syncFamilyFailure: ['errorMessage'],
})

export const SyncFamilyTypes = Types
export default Creators
