import { createStore, applyMiddleware, combineReducers } from 'redux';
import reducer from './reducer';
import { createThunkMiddleware } from './thunk';
import { errorHandler } from './errorHandler';

const middleware = applyMiddleware(createThunkMiddleware(errorHandler));

export const store = createStore(reducer, middleware);