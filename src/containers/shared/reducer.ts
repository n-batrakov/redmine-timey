import { SharedStateAction } from './types';
import { Enumeration, EnumerationsLookup } from '../../shared/types';

const nullEnumeration: Enumeration = {
    values: {},
    defaultValue: '',
};
const nullEnumerationsLookup: EnumerationsLookup = {
    activity: nullEnumeration,
    priority: nullEnumeration,
    status: nullEnumeration,
    projects: nullEnumeration,
    queries: nullEnumeration,
    users: nullEnumeration,
};

export const enumerationsReducer = (state: EnumerationsLookup, action: SharedStateAction): EnumerationsLookup => {
    if (state === undefined) return nullEnumerationsLookup;

    switch (action.type) {
        case 'enumerations_setValue':
            return action.data;
        default:
            return state;
    }
};


export const isLoggedInReducer = (state: boolean, action: SharedStateAction): boolean => {
    if (state === undefined) return true;

    switch (action.type) {
        case 'auth_loggedIn':
            return action.isLoggedIn;
        default:
            return state;
    }
};