import { put, call, delay } from 'redux-saga/effects'
import ResidentActions from 'App/Stores/Resident/Actions'
import SyncResidentActions from 'App/Stores/SyncResident/Actions'
import { residentService } from 'App/Services/ResidentService'
import residentSqlite from 'App/Database/residentSqlite'

export function* syncResident(action) {
  const { userid, userToken } = action
  yield put(SyncResidentActions.syncResidentLoading())
  yield delay(200)
  const residentDb = new residentSqlite
  yield call(residentDb.initDB)
  let residentLoop = true;
  let current_page = 1;
  let page_last = 0;
  while (residentLoop) {
    const response = yield call(residentService.fetchData, current_page, userToken)
    if (response.status === 'ok') {
      page_last = response.meta.page_last

      yield put(ResidentActions.fetchResidentSuccess(response))
      yield put(SyncResidentActions.syncResidentProgress(Math.round((current_page / page_last) * 100) / 100))
      const data = response.data
      for (r of data) {
        console.log("resident:" + JSON.stringify(r))
        const findResident = yield call(residentDb.findByIdartbdt, userid, r.idartbdt)
        if (!findResident) {
          yield call(residentDb.insertRow, userid, r)
        } else {
          yield call(residentDb.updateByIdartbdt, userid, r.idartbdt, r)
        }
        yield delay(200)
      }
    } else {
      yield put(ResidentActions.fetchResidentFailure(response))
    }
    if (!page_last) {
      residentLoop = false
    }
    current_page = current_page + 1
    if (current_page > page_last) {
      residentLoop = false;
    }
  }
  yield put(SyncResidentActions.syncResidentSuccess({ model: "resident" }))
  yield put({ type: 'SYNC_RESIDENT_DONE' })
}