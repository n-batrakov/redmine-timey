import { TimingsPageAction, TimingsPageThunk } from './types';

import { addDays, getMonthBoundaries } from 'shared/date';

import { getDailyHours } from '../../api/getDailyHours';
import { getMonthNorm } from '../../api/getMonthNorm';

import { ActivityHeatmapProps } from '../../components/activityHeatmap';
import { HoursGaugeProps } from '../../components/hoursGauge';


export const setLoader = (): TimingsPageAction => ({
    type: 'timings_setLoader',
});

export const setData = (data: {heatmap: ActivityHeatmapProps, gauge: HoursGaugeProps}): TimingsPageAction => ({
    data,
    type: 'timings_setData',
});

export const loadData = (): TimingsPageThunk =>
    async (dispatch) => {
        const now = new Date();

        const heatmapEnd = now;
        const heatmapStart = addDays(heatmapEnd, -365);
        const calendar$ = getDailyHours({ start: heatmapStart, end: heatmapEnd });

        const [thisMonthStart, nextMonthStart] = getMonthBoundaries(now);
        const norm$ = getMonthNorm();

        const [calendar, { norm }] = await Promise.all([calendar$, norm$]);

        const actualNorm = calendar
            .filter(({ date }) => date >= thisMonthStart && date < nextMonthStart)
            .reduce((acc, x) => acc + x.count, 0);

        const data = {
            heatmap: {
                startDate: heatmapStart,
                endDate: heatmapEnd,
                data: calendar,
            },
            gauge: {
                actualValue: actualNorm,
                expectedValue: norm,
            },
        };

        dispatch(setData(data));
    };