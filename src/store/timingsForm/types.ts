import { Dispatch, Action } from 'redux';
import { AppState } from '..';
import { ThunkAction } from '../thunk';

export type TimingsFormState = {
    success: boolean,
    loading: boolean,
    error?: string,
};

export type TimingsFormAction = {
    type: 'timingsForm_success',
} | {
    type: 'timingsForm_error',
    error: string,
} | {
    type: 'timingForm_loading',
};

export type TimingsFormThunk = ThunkAction<any, AppState, {}, TimingsFormAction>;

export type TimingsFormDispath = Dispatch<Action<TimingsFormAction | TimingsFormThunk>>;