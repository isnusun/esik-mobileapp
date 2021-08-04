import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginLoading: null,
  loginSuccess: ['response'],
  loginFailure: ['errorMessage'],
  logout: null,
  getProfile: ['userToken'],
  getProfileSuccess: ['response'],
  updateProfile: ['userToken', 'nama', 'email', 'nohp', 'foto'],
  updateProfileSuccess: ['response'],
})

export const AuthTypes = Types
export default Creators
