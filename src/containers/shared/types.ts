import { EnumerationsLookup } from '../../shared/types';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

export type SharedState = {
    isLoggedIn: boolean,
    enumerations: EnumerationsLookup,
};

export type SharedStateAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
} | {
    type: 'auth_loggedIn',
    isLoggedIn: boolean,
};

export type SharedStateThunk = ThunkAction<any, AppState, {}, SharedStateAction>;