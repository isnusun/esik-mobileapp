import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchResidentIndicator: ['userToken'],
  fetchResidentIndicatorLoading: null,
  fetchResidentIndicatorSuccess: ['data'],
  fetchResidentIndicatorFailure: ['errorMessage'],
})

export const ResidentIndicatorTypes = Types
export default Creators
