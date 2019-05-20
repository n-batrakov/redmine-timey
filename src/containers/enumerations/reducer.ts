import { EnumerationsAction, EnumerationsState } from './types';
import { Enumeration } from '../../shared/types';

const nullEnumeration: Enumeration = {
    values: {},
    defaultValue: '',
};

const initState: EnumerationsState = {
    isLoaded: false,
    activity: nullEnumeration,
    priority: nullEnumeration,
    status: nullEnumeration,
    projects: nullEnumeration,
    queries: nullEnumeration,
    users: nullEnumeration,
};

export const reducer = (state: EnumerationsState, action: EnumerationsAction): EnumerationsState => {
    if (state === undefined) {
        return initState;
    }

    switch (action.type) {
        case 'enumerations_setValue':
            return {
                isLoaded: true,
                ...action.data,
            };
        default:
            return state;
    }
};