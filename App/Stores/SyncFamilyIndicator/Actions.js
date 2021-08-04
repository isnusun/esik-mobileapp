import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  syncFamilyIndicator: ['userid', 'userToken'],
  syncFamilyIndicatorProgress: ['progress'],
  syncFamilyIndicatorLoading: null,
  syncFamilyIndicatorSuccess: ['data'],
  syncFamilyIndicatorFailure: ['errorMessage'],
})

export const SyncFamilyIndicatorTypes = Types
export default Creators
