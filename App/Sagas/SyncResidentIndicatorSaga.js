import { put, call, delay } from 'redux-saga/effects'
import ResidentIndicatorActions from 'App/Stores/ResidentIndicator/Actions'
import SyncResidentIndicatorActions from 'App/Stores/SyncResidentIndicator/Actions'
import { residentIndicatorService } from 'App/Services/ResidentIndicatorService'
import residentIndicatorSqlite from 'App/Database/residentIndicatorSqlite'

export function* syncResidentIndicator(action) {
  const { userid, userToken } = action
  yield put(SyncResidentIndicatorActions.syncResidentIndicatorLoading())
  yield delay(200)
  const residentIndicatorDb = new residentIndicatorSqlite
  yield call(residentIndicatorDb.initDB)

  const response = yield call(residentIndicatorService.fetchData, userToken)
  if (response.status === 'ok') {

    yield put(ResidentIndicatorActions.fetchResidentIndicatorSuccess(response))
    const data = response.data
    // console.log(JSON.stringify(data))
    const ldr = data.length
    let cr = 1
    for (ri of data) {

      yield put(SyncResidentIndicatorActions.syncResidentIndicatorProgress(Math.round((cr / ldr) * 100) / 100))
      // console.log("residentIndicator:" + JSON.stringify(ri))
      const findResidentIndicator = yield call(residentIndicatorDb.findById, userid, ri.id)
      if (!findResidentIndicator) {
        yield call(residentIndicatorDb.insertRow, userid, ri)
      } else {
        yield call(residentIndicatorDb.updateById, userid, ri.id, ri)
      }
      yield delay(200)
      cr++
    }
  } else {
    yield put(ResidentIndicatorActions.fetchResidentIndicatorFailure(response))
  }

  yield put(SyncResidentIndicatorActions.syncResidentIndicatorSuccess({ model: "residentIndicator" }))
  yield put({ type: 'SYNC_RESIDENT_INDICATOR_DONE' })
}