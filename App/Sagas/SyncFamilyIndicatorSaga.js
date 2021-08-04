import { put, call, delay } from 'redux-saga/effects'
import SyncActions from 'App/Stores/Sync/Actions'
import FamilyIndicatorActions from 'App/Stores/FamilyIndicator/Actions'
import SyncFamilyIndicatorActions from 'App/Stores/SyncFamilyIndicator/Actions'
import { familyIndicatorService } from 'App/Services/FamilyIndicatorService'
import familyIndicatorSqlite from 'App/Database/familyIndicatorSqlite'

export function* syncFamilyIndicator(action) {
  const { userid, userToken } = action
  yield put(SyncFamilyIndicatorActions.syncFamilyIndicatorLoading())
  yield delay(200)
  const familyIndicatorDb = new familyIndicatorSqlite
  yield call(familyIndicatorDb.initDB)

  const response = yield call(familyIndicatorService.fetchData, userToken)
  if (response.status === 'ok') {

    yield put(FamilyIndicatorActions.fetchFamilyIndicatorSuccess(response))
    const data = response.data
    // console.log(JSON.stringify(data))
    const ldf = data.length
    let cf = 1
    for (fi of data) {

      yield put(SyncFamilyIndicatorActions.syncFamilyIndicatorProgress(Math.round((cf / ldf) * 100) / 100))
      // console.log("familyIndicator:" + JSON.stringify(fi))
      const findFamilyIndicator = yield call(familyIndicatorDb.findById, userid, fi.id)
      if (!findFamilyIndicator) {
        yield call(familyIndicatorDb.insertRow, userid, fi)
      } else {
        yield call(familyIndicatorDb.updateById, userid, fi.id, fi)
      }
      yield delay(200)
      cf++
    }
  } else {
    yield put(FamilyIndicatorActions.fetchFamilyIndicatorFailure(response))
  }

  yield put(SyncFamilyIndicatorActions.syncFamilyIndicatorSuccess({ model: "familyIndicator" }))
  yield put({ type: 'SYNC_FAMILY_INDICATOR_DONE' })
}