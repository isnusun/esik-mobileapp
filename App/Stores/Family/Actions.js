import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  resetFamily: null,
  fetchFamily: ['page', 'userToken'],
  fetchFamilyLoading: null,
  fetchFamilySuccess: ['data'],
  fetchFamilyFailure: ['errorMessage'],
  postFamily: ['userToken', 'idbdt', 'data'],
  postFamilyLoading: null,
  postFamilySuccess: ['data'],
  postFamilyFailure: ['errorMessage'],
})

export const FamilyTypes = Types
export default Creators
