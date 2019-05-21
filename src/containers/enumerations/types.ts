import { EnumerationsLookup } from '../../shared/types';
import { AppState } from '../../store';
import { ThunkAction } from '../../store/thunk';

export type EnumerationsState = EnumerationsLookup & {
    isLoaded: boolean,
};

export type EnumerationsAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
};

export type EnumerationsThunk = ThunkAction<any, AppState, {}, EnumerationsAction>;