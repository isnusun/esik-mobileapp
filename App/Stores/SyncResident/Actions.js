import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  syncResident: ['userid', 'userToken'],
  syncResidentProgress: ['progress'],
  syncResidentLoading: null,
  syncResidentSuccess: ['data'],
  syncResidentFailure: ['errorMessage'],
})

export const SyncResidentTypes = Types
export default Creators
