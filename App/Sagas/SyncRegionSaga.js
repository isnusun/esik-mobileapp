import { put, call } from 'redux-saga/effects'
import SyncRegionActions from 'App/Stores/SyncRegion/Actions'
import { regionService } from 'App/Services/RegionService'

export function* fetchSyncRegion(action) {
  const { userToken } = action
  yield put(SyncRegionActions.fetchRegionLoading())

  const response = yield call(regionService.fetchData, userToken)
  // console.log(JSON.stringify(response))

  if (response.status === 'ok') {
    yield put(SyncRegionActions.fetchRegionSuccess(response))
  } else {
    yield put(SyncRegionActions.fetchRegionFailure(response))
  }
}