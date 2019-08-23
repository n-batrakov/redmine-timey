import { Dispatch, Action } from 'redux';
import { AppState } from '..';
import { ThunkAction } from '../thunk';
import { TimesheetEntry } from '../../shared/types';

export type TimingsFormState = {
    success: boolean,
    loading: boolean,
    error?: string,
    entry?: TimesheetEntry,
};

export type TimingsFormAction = {
    type: 'timingsForm_success',
} | {
    type: 'timingsForm_error',
    error: string,
} | {
    type: 'timingForm_loading',
} | {
    type: 'timingForm_setEntry',
    entry: TimesheetEntry,
} | {
    type: 'timingForm_removeEntry',
};

export type TimingsFormThunk = ThunkAction<any, AppState, {}, TimingsFormAction>;

export type TimingsFormDispath = Dispatch<Action<TimingsFormAction | TimingsFormThunk>>;