import { takeLatest, all } from 'redux-saga/effects'
// import { ExampleTypes } from 'App/Stores/Example/Actions'
// import { StartupTypes } from 'App/Stores/Startup/Actions'
import { AuthTypes } from 'App/Stores/Auth/Actions'
import { SyncTypes } from 'App/Stores/Sync/Actions'
import { FamilyTypes } from 'App/Stores/Family/Actions'
import { ResidentTypes } from 'App/Stores/Resident/Actions'
import { SyncFamilyTypes } from 'App/Stores/SyncFamily/Actions'
import { SyncResidentTypes } from 'App/Stores/SyncResident/Actions'
import { SyncFamilyIndicatorTypes } from 'App/Stores/SyncFamilyIndicator/Actions'
import { SyncResidentIndicatorTypes } from 'App/Stores/SyncResidentIndicator/Actions'

import { loginRequest, logout, updateProfile } from './AuthSaga'
import { fetchFamily, postFamily, resetFamily } from './FamilySaga'
import { postResident, resetResident } from './ResidentSaga'
import { startSync, stopSync } from './SyncSaga'
import { syncFamily } from './SyncFamilySaga'
import { syncResident } from './SyncResidentSaga'
import { syncFamilyIndicator } from './SyncFamilyIndicatorSaga'
import { syncResidentIndicator } from './SyncResidentIndicatorSaga'

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */

    takeLatest(AuthTypes.LOGIN_REQUEST, loginRequest),

    takeLatest(AuthTypes.LOGOUT, logout),

    takeLatest(AuthTypes.UPDATE_PROFILE, updateProfile),

    takeLatest(FamilyTypes.FETCH_FAMILY, fetchFamily),

    takeLatest(SyncTypes.START_SYNC, startSync),

    takeLatest(SyncTypes.STOP_SYNC, stopSync),

    takeLatest(SyncFamilyTypes.SYNC_FAMILY, syncFamily),

    takeLatest(SyncResidentTypes.SYNC_RESIDENT, syncResident),

    takeLatest(SyncFamilyIndicatorTypes.SYNC_FAMILY_INDICATOR, syncFamilyIndicator),

    takeLatest(SyncResidentIndicatorTypes.SYNC_RESIDENT_INDICATOR, syncResidentIndicator),

    takeLatest(FamilyTypes.POST_FAMILY, postFamily),

    takeLatest(ResidentTypes.POST_RESIDENT, postResident),

    takeLatest(FamilyTypes.RESET_FAMILY, resetFamily),

    takeLatest(ResidentTypes.RESET_RESIDENT, resetResident),

  ])
}
