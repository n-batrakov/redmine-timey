import { EnumerationsLookup } from '../../shared/types';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

export type EnumerationsState = EnumerationsLookup & {
    isLoaded: boolean,
};

export type EnumerationsAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
};

export type EnumerationsThunk = ThunkAction<any, AppState, {}, EnumerationsAction>;