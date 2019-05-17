import { EnumerationsLookup } from '../../shared/types';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

export type SharedState = {
    enumerations: EnumerationsLookup,
};

export type SharedStateAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
};

export type SharedStateThunk = ThunkAction<any, AppState, {}, SharedStateAction>;