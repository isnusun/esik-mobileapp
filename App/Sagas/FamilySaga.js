import { put, call } from 'redux-saga/effects'
import FamilyActions from 'App/Stores/Family/Actions'
import { familyService } from 'App/Services/FamilyService'
import NavigationService from '../Services/NavigationService'

export function* fetchFamily(action) {
  const { page, userToken } = action
  yield put(FamilyActions.fetchFamilyLoading())

  const response = yield call(familyService.fetchData, page, userToken)
  if (response.status === 'ok') {
    yield put(FamilyActions.fetchFamilySuccess(response))
  } else {
    yield put(FamilyActions.fetchFamilyFailure(response))
  }
}

export function* postFamily(action) {
  yield put(FamilyActions.postFamilyLoading(action.data))
  const response = yield call(familyService.postFamily, action.userToken, action.idbdt, action.data);
  if (response.status === 'ok') {
    yield put(FamilyActions.postFamilySuccess(response));
    NavigationService.navigate('Respondent')

  } else {
    yield put(FamilyActions.postFamilyFailure(response))
    setTimeout(() => {
      console.log(JSON.stringify(response))
    }, 200);
  }
}

export function* resetFamily() {
}