import { ThunkAction, AppState } from 'state';
import { Dispatch, Action } from 'redux';

export type CalendarState = {
    year: number,
    month: number,
    selectedDate?: Date,
    data: { [key: string]: number },
};

export type CalendarAction = {
    type: 'calendar_setData',
    data: { [key: string]: number },
} | {
    type: 'calendar_selectDay',
    date?: Date,
} | {
    type: 'calendar_setMonth',
    year: number,
    month: number,
};

export type CalendarThunk = ThunkAction<any, AppState, {}, CalendarAction>;
export type CalendarDispatch = Dispatch<Action<CalendarAction | CalendarThunk>>;