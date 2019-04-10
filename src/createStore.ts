import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer } from './pages/timings/store/reducer';

export const store = createStore(
    combineReducers({ activityList: reducer }),
    applyMiddleware(thunk),
);