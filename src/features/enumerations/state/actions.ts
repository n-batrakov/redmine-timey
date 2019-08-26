import { Dispatch } from 'redux';
import { getEnumerations } from '../api/getEnumerations';
import { EnumerationsAction } from './types';
import { AppState } from 'store';

export const loadEnumerations = () =>
    async (dispatch: Dispatch<EnumerationsAction>, getState: () => AppState) => {
        if (getState().enumerations.isLoaded) {
            return;
        }

        const data = await getEnumerations();
        dispatch({ data, type: 'enumerations_setValue' });
    };