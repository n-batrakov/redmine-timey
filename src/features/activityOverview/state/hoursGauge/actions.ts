import { HoursGaugeThunk } from './types';
import { getMonthNorm } from 'features/activityOverview/api/getMonthNorm';
import { GetMonthNormRequest } from 'features/activityOverview/api/getMonthNorm/contract';

export const loadHoursGaugeData = (params: GetMonthNormRequest): HoursGaugeThunk => async (dispatch) => {
    const response = await getMonthNorm(params);

    switch (response.code) {
        case 'Success':
            dispatch({ type: 'hours_setData', data: response.data });
            break;
        case 'Error':
        case 'NotAuthenticated':
            console.error(response);
            break;
    }
};