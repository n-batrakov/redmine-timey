import { EnumerationsLookup } from '../../shared/types';

export type SharedState = {
    isLoggedIn: boolean,
    enumerations: EnumerationsLookup,
};

export type SharedStateAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
} | {
    type: 'auth_toggle',
};