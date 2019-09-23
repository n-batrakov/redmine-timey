import { CalendarState, CalendarAction } from './types';
import { assertNever } from 'shared/utils';

export const initialState: CalendarState = ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    data: {},
    selectedDate: undefined,
});

export const reducer = (state: CalendarState, action: CalendarAction): CalendarState => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case 'calendar_setData':
            return {
                ...state,
                data: { ...state.data, ...action.data },
            };
        case 'calendar_setMonth':
            if (state.year === action.year && state.month === action.month) {
                return state;
            }
            return { ...state, year: action.year, month: action.month };
        case 'calendar_selectDay':
            return { ...state, selectedDate: action.date };
        default:
            assertNever(action);
            return state;
    }
};
