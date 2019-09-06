import { Reducer } from 'redux';

export const sumReducers = (...reducers: Reducer[]): Reducer => (state, action) => {
    return reducers.reduce((prevState, reducer) => reducer(prevState, action), state);
};