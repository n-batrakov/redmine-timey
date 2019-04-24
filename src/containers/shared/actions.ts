import { Dispatch } from 'redux';
import { getEnumerations } from '../../api/getEnumerations';
import { SharedStateAction } from './types';

export const loadEnumerations = () =>
    async (dispatch: Dispatch<SharedStateAction>) => {
        const data = await getEnumerations();
        dispatch({ data, type: 'enumerations_setValue' });
    };

export const toggleLogin = (): SharedStateAction => ({ type: 'auth_toggle' });