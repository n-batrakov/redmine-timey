import { ActivityHeatmapProps } from '../../components/activityHeatmap';
import { HoursGaugeProps } from '../../components/hoursGauge';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

export type TimingsPageState = {
    heatmap?: ActivityHeatmapProps,
    gauge?: HoursGaugeProps,
};

export type TimingsPageAction = {
    type: 'timings_setData',
    data: { heatmap: ActivityHeatmapProps, gauge: HoursGaugeProps },
};

export type TimingsPageThunk = ThunkAction<any, AppState, {}, TimingsPageAction>;

export type TimingsPageDispath = Dispatch<Action<TimingsPageAction | TimingsPageThunk>>;