import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from './pages/timings/store/reducer';
import { isLoggedInReducer, enumerationsReducer } from './pages/shared/store/reducer';
import { loadEnumerations } from './pages/shared/store';


export const store = createStore(
    combineReducers({
        activityList: activityListReducer,
        isLoggedIn: isLoggedInReducer,
        enumerations: enumerationsReducer,
    }),
    applyMiddleware(thunk),
);

loadEnumerations()(store.dispatch);