import { CalendarAction, CalendarThunk } from './types';
import { getDailyHours } from 'features/activityOverview/api/getDailyHours';
import { getMonthBoundaries } from 'shared/date';

export const selectDay = (date?: Date): CalendarAction => ({
    date,
    type: 'calendar_selectDay',
});


export const selectMonth = (year: number, month: number): CalendarThunk => (dispatch, getState) => {
    dispatch({ year, month, type: 'calendar_setMonth' });

    const [start, end] = getMonthBoundaries(new Date(year, month, 1), true);

    const currentData = getState().calendar.data;

    // TODO: check if data is already present

    getDailyHours({ start, end })
    .then((response) => {
        const newData = response.reduce(
            (acc, x) => {
                const key = getDayKey(x.date);
                acc[key] = x.count;
                return acc;
            },
            {} as any,
        );

        dispatch({
            type: 'calendar_setData',
            data: { ...currentData, ...newData },
        });
    })
    .catch(x => console.error(x))
    ;
};

export function getDayKey(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}