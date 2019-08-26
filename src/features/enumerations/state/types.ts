import { AppState, ThunkAction } from 'state';
import { EnumerationsLookup } from 'shared/types';

export type EnumerationsState = EnumerationsLookup & {
    isLoaded: boolean,
};

export type EnumerationsAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
};

export type EnumerationsThunk = ThunkAction<any, AppState, {}, EnumerationsAction>;