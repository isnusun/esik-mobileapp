import { all, put } from 'redux-saga/effects'
import SyncActions from 'App/Stores/Sync/Actions'
import NavigationService from '../Services/NavigationService'

export function* startSync(action) {
  const { userid, userToken } = action
  yield put(SyncActions.syncLoading())
  NavigationService.navigateAndReset('SyncData')
  yield all([
    yield put({ type: 'SYNC_FAMILY', userid, userToken }),
    yield put({ type: 'SYNC_RESIDENT', userid, userToken }),
    yield put({ type: 'SYNC_FAMILY_INDICATOR', userid, userToken }),
    yield put({ type: 'SYNC_RESIDENT_INDICATOR', userid, userToken })
  ])
}

export function* stopSync() {
  yield put(SyncActions.syncSuccess())
  NavigationService.navigateAndReset('AuthLoading')
}
