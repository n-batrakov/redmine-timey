import { ThunkAction, AppState } from 'state';
import { Dispatch, Action } from 'redux';


type HoursGaugeData = {
    actualValue: number,
    expectedValue: number,
}

export type HoursGaugeState = {
    data: HoursGaugeData,
};

export type HoursGaugeActions = {
    type: 'hours_setData',
    data: HoursGaugeData,
};

export type HoursGaugeThunk = ThunkAction<any, AppState, {}, HoursGaugeActions>;

export type HoursGaugeDispath = Dispatch<Action<HoursGaugeActions | HoursGaugeThunk>>;