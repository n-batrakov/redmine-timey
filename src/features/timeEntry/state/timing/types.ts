import { Dispatch, Action } from 'redux';
import { AppState } from 'store';
import { ThunkAction } from 'store/thunk';
import { TimesheetEntry } from 'shared/types';

export type TimingsFormState = {
    success: boolean,
    loading: boolean,
    error?: string,
    entry?: TimesheetEntry,
};

export type TimingsFormAction =
    | { type: 'timing_loading' }
    | { type: 'timing_error', error: string }
    | { type: 'timing_setEntry', entry: TimesheetEntry }
    | { type: 'timing_addEntry', entry: TimesheetEntry }
    | { type: 'timing_updateEntry', entry: TimesheetEntry }
    | { type: 'timing_removeEntry' }
    | { type: 'timing_reset' }
    ;

export type TimingsFormThunk = ThunkAction<any, AppState, {}, TimingsFormAction>;

export type TimingsFormDispath = Dispatch<Action<TimingsFormAction | TimingsFormThunk>>;