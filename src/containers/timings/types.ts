import { ActivityHeatmapProps } from '../../components/activityHeatmap';
import { HoursGaugeProps } from '../../components/hoursGauge';
import { Dispatch, Action } from 'redux';
import { AppState } from '../../store';
import { ThunkAction } from '../../store/thunk';

export type TimingsPageState = {
    isLoading: boolean,
    heatmap?: ActivityHeatmapProps,
    gauge?: HoursGaugeProps,
};

export type TimingsPageAction = {
    type: 'timings_setData',
    data: { heatmap: ActivityHeatmapProps, gauge: HoursGaugeProps },
} | {
    type: 'timings_setLoader',
};

export type TimingsPageThunk = ThunkAction<any, AppState, {}, TimingsPageAction>;

export type TimingsPageDispath = Dispatch<Action<TimingsPageAction | TimingsPageThunk>>;