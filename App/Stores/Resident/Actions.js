import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  resetResident: null,
  fetchResident: null,
  fetchResidentLoading: null,
  fetchResidentSuccess: ['data'],
  fetchResidentFailure: ['errorMessage'],
  postResident: ['userToken', 'idbdt', 'idartbdt', 'data'],
  postResidentLoading: null,
  postResidentSuccess: ['data'],
  postResidentFailure: ['errorMessage'],
})

export const ResidentTypes = Types
export default Creators
