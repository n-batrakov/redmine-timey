import { Dispatch } from 'redux';
import { getEnumerations } from '../../api/getEnumerations';
import { EnumerationsAction } from './types';
import { AppState } from '../../state';

export const loadEnumerations = () =>
    (dispatch: Dispatch<EnumerationsAction>, getState: () => AppState) => {
        if (getState().enumerations.isLoaded) {
            return;
        }

        getEnumerations()
        .then((data) => {
            dispatch({ data, type: 'enumerations_setValue' });
        })
        .catch((err) => {
            console.error(err);
        });
    };