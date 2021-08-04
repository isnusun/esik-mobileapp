import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from 'App/Sagas'
import { reducer as ExampleReducer } from './Example/Reducers'
import { reducer as AuthReducer } from './Auth/Reducers'
import { reducer as FamilyReducer } from './Family/Reducers'
import { reducer as ResidentReducer } from './Resident/Reducers'
import { reducer as FamilyIndicatorReducer } from './FamilyIndicator/Reducers'
import { reducer as ResidentIndicatorReducer } from './ResidentIndicator/Reducers'
import { reducer as SyncReducer } from './Sync/Reducers'
import { reducer as SyncFamilyReducer } from './SyncFamily/Reducers'
import { reducer as SyncResidentReducer } from './SyncResident/Reducers'
import { reducer as SyncFamilyIndicatorReducer } from './SyncFamilyIndicator/Reducers'
import { reducer as SyncResidentIndicatorReducer } from './SyncResidentIndicator/Reducers'
import { reducer as SyncRegionReducer } from './SyncRegion/Reducers'

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    example: ExampleReducer,
    auth: AuthReducer,
    family: FamilyReducer,
    resident: ResidentReducer,
    familyIndicator: FamilyIndicatorReducer,
    residentIndicator: ResidentIndicatorReducer,
    sync: SyncReducer,
    syncFamily: SyncFamilyReducer,
    syncResident: SyncResidentReducer,
    syncFamilyIndicator: SyncFamilyIndicatorReducer,
    syncResidentIndicator: SyncResidentIndicatorReducer,
    syncRegion: SyncRegionReducer,
  })

  return configureStore(rootReducer, rootSaga)
}
