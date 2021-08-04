import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchFamilyIndicator: ['userToken'],
  fetchFamilyIndicatorLoading: null,
  fetchFamilyIndicatorSuccess: ['data'],
  fetchFamilyIndicatorFailure: ['errorMessage'],
})

export const FamilyIndicatorTypes = Types
export default Creators
