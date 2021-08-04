import { put, call } from 'redux-saga/effects'
import AuthActions from 'App/Stores/Auth/Actions'
import { authService } from 'App/Services/AuthService'
import NavigationService from '../Services/NavigationService'

export function* loginRequest(action) {
  const { username, password } = action
  yield put(AuthActions.loginLoading())
  const response = yield call(authService.attemptLogin, username, password)
  if (response.status === 'ok') {
    yield put(AuthActions.loginSuccess(response))
    NavigationService.navigateAndReset('AppStack')
  } else {
    yield put(AuthActions.loginFailure(response))
  }
}

export function* logout() {
  NavigationService.navigateAndReset('SignIn')
}

export function* getProfile(action) {
  const { userToken } = action
  const response = yield call(authService.getProfile, userToken)
  if (response.status === 'ok') {
    yield put(AuthActions.getProfileSuccess(response))
  }
}

export function* updateProfile(action) {
  const response = yield call(authService.updateProfile, action.userToken, action.nama, action.email, action.nohp, action.foto);
  if (response.status === 'ok') {
      yield put(AuthActions.updateProfileSuccess(response));
      NavigationService.navigate('Profile')

  } else {
      setTimeout(() => {
        console.log(JSON.stringify(response))
      }, 200);
  }
}