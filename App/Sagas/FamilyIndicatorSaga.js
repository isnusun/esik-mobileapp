import { put, call } from 'redux-saga/effects'
import FamilyIndicatorActions from 'App/Stores/FamilyIndicator/Actions'
import { familyIndicatorService } from 'App/Services/FamilyIndicatorService'

export function* fetchFamilyIndicator(action) {
  const { userToken } = action
  yield put(FamilyIndicatorActions.fetchFamilyIndicatorLoading())

  const response = yield call(familyIndicatorService.fetchData, userToken)
  if (response.status === 'ok') {
    yield put(FamilyIndicatorActions.fetchFamilyIndicatorSuccess(response))
  } else {
    yield put(FamilyIndicatorActions.fetchFamilyIndicatorFailure(response))
  }
}