import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  syncResidentIndicator: ['userid', 'userToken'],
  syncResidentIndicatorProgress: ['progress'],
  syncResidentIndicatorLoading: null,
  syncResidentIndicatorSuccess: ['data'],
  syncResidentIndicatorFailure: ['errorMessage'],
})

export const SyncResidentIndicatorTypes = Types
export default Creators
