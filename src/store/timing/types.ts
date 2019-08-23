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
    type: 'timing_success',
} | {
    type: 'timing_error',
    error: string,
} | {
    type: 'timing_loading',
} | {
    type: 'timing_setEntry',
    entry: TimesheetEntry,
} | {
    type: 'timing_removeEntry',
};

export type TimingsFormThunk = ThunkAction<any, AppState, {}, TimingsFormAction>;

export type TimingsFormDispath = Dispatch<Action<TimingsFormAction | TimingsFormThunk>>;