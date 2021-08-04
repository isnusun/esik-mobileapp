import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchRegion: ['userToken'],
  fetchRegionLoading: null,
  fetchRegionSuccess: ['data'],
  fetchRegionFailure: ['errorMessage'],
})

export const SyncRegionTypes = Types
export default Creators
