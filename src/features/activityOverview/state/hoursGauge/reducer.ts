import { HoursGaugeState, HoursGaugeActions } from './types';
import { Reducer } from 'redux';

export const initialState: HoursGaugeState = {
    data: { actualValue: 0, expectedValue: 160 },
};

export const reducer: Reducer<HoursGaugeState, HoursGaugeActions> = (state, action) => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case 'hours_setData':
            return {
                data: action.data,
            };
        default:
            return state;
    }
};