import { Dispatch, Action } from 'redux';
import { AppState, ThunkAction } from 'state';
import { TimesheetEntry, NamedId } from 'shared/types';
import { LayoutView } from 'features/timeEntry/components/layout';

export type TimingsFormState = {
    success: boolean,
    loading: boolean,
    error?: string,
    entry?: TimesheetEntry,
    selectedIssue?: NamedId,
    view: LayoutView,
};

export type TimingsFormAction =
    | { type: 'timing_loading' }
    | { type: 'timing_error', error: string }
    | { type: 'timing_setEntry', entry: TimesheetEntry }
    | { type: 'timing_addEntry', entry: TimesheetEntry }
    | { type: 'timing_updateEntry', entry: TimesheetEntry }
    | { type: 'timing_removeEntry' }
    | { type: 'timing_reset' }
    | { type: 'timing_selectIssue', issue?: NamedId }
    | { type: 'timing_setView', view: LayoutView }
    ;

export type TimingsFormThunk = ThunkAction<any, AppState, {}, TimingsFormAction>;

export type TimingsFormDispath = Dispatch<Action<TimingsFormAction | TimingsFormThunk>>;
