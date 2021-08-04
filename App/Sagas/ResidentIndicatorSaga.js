import { put, call } from 'redux-saga/effects'
import ResidentIndicatorActions from 'App/Stores/ResidentIndicator/Actions'
import { residentIndicatorService } from 'App/Services/ResidentIndicatorService'

export function* fetchResidentIndicator(action) {
  const { userToken } = action
  yield put(ResidentIndicatorActions.fetchResidentIndicatorLoading())

  const response = yield call(residentIndicatorService.fetchData, userToken)
  if (response.status === 'ok') {
    yield put(ResidentIndicatorActions.fetchResidentIndicatorSuccess(response))
  } else {
    yield put(ResidentIndicatorActions.fetchResidentIndicatorFailure(response))
  }
}