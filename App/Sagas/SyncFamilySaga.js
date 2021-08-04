import { put, call, delay } from 'redux-saga/effects'
import FamilyActions from 'App/Stores/Family/Actions'
import SyncFamilyActions from 'App/Stores/SyncFamily/Actions'
import { familyService } from 'App/Services/FamilyService'
import familySqlite from 'App/Database/familySqlite'

export function* syncFamily(action) {
  const { userid, userToken } = action
  yield put(SyncFamilyActions.syncFamilyLoading())
  yield delay(200)
  const familyDb = new familySqlite
  yield call(familyDb.initDB)
  let familyLoop = true;
  let current_page = 1;
  let page_last = 0;
  while (familyLoop) {
    const response = yield call(familyService.fetchData, current_page, userToken)
    if (response.status === 'ok') {
      page_last = response.meta.page_last

      yield put(FamilyActions.fetchFamilySuccess(response))
      yield put(SyncFamilyActions.syncFamilyProgress(Math.round((current_page / page_last) * 100) / 100))
      const data = response.data
      for (f of data) {
        // console.log("family:" + JSON.stringify(f))
        const findFamily = yield call(familyDb.findByIdbdt, userid, f.idbdt)
        if (!findFamily) {
          yield call(familyDb.insertRow, userid, f)
        } else {
          yield call(familyDb.updateByIdbdt, userid, f.idbdt, f)
        }
        yield delay(200)
      }
    } else {
      yield put(FamilyActions.fetchFamilyFailure(response))
    }
    if (!page_last) {
      familyLoop = false
    }
    current_page = current_page + 1
    if (current_page > page_last) {
      familyLoop = false;
    }
  }
  yield put(SyncFamilyActions.syncFamilySuccess({ model: "family" }))
  yield put({ type: 'SYNC_FAMILY_DONE' })
}