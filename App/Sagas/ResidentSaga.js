import { put, call } from 'redux-saga/effects'
import ResidentActions from 'App/Stores/Resident/Actions'
import { residentService } from 'App/Services/ResidentService'
import NavigationService from '../Services/NavigationService'

export function* postResident(action) {
  yield put(ResidentActions.postResidentLoading(action.data))
  const response = yield call(residentService.postResident, action.userToken, action.idbdt, action.idartbdt, action.data);
  if (response.status === 'ok') {
    yield put(ResidentActions.postResidentSuccess(response));
    NavigationService.navigate('Respondent')

  } else {
    yield put(ResidentActions.postResidentFailure(response))
    setTimeout(() => {
      console.log(JSON.stringify(response))
    }, 200);
  }
}

export function* resetResident() {
}