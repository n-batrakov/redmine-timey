import { Dispatch } from 'redux';
import { EnumerationsLookup } from '../../../shared/types';
import { getEnumerations } from '../../../api/getEnumerations';

export type SharedState = {
    isLoggedIn: boolean,
    enumerations: EnumerationsLookup,
};

export type SharedStateAction = {
    type: 'enumerations_setValue',
    data: EnumerationsLookup,
} | {
    type: 'auth_logout',
};

export const loadEnumerations = () =>
    async (dispatch: Dispatch<SharedStateAction>) => {
        const data = await getEnumerations();
        dispatch({ data, type: 'enumerations_setValue' });
    };

export const logOut = (): SharedStateAction => ({ type: 'auth_logout' });