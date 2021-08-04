import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchRegion: null,
  fetchRegionLoading: null,
  fetchRegionSuccess: ['data'],
  fetchRegionFailure: ['errorMessage'],
})

export const RegionTypes = Types
export default Creators
