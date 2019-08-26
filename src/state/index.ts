import { useSelector } from 'react-redux';
import { TimingsPageAction, TimingsPageState } from 'features/activityOverview/state/timingList/types';
import { ActivityListAction, ActivityListState } from 'features/activityOverview/state/activityList/types';
import { EnumerationsAction, EnumerationsState } from 'features/enumerations/state/types';
import { IssuesAction, IssuesState } from 'features/timeEntry/state/issues/types';
import { AuthAction, AuthState } from 'features/auth/state/types';
import { TimingsFormAction, TimingsFormState } from 'features/timeEntry/state/timing/types';

export { ThunkAction, ThunkDispatch, ThunkErrorHandler } from './thunk';

export type AppState = {
    enumerations: EnumerationsState,
    timingsPage: TimingsPageState,
    timingsForm: TimingsFormState,
    activityList: ActivityListState,
    issues: IssuesState,
    auth: AuthState,
};


export type AppAction =
    | TimingsPageAction
    | TimingsFormAction
    | ActivityListAction
    | EnumerationsAction
    | IssuesAction
    | AuthAction
    ;


export function useAppState<T>(selector: (s: AppState) => T, equalityFn?: (a: T, b: T) => boolean): T {
    return useSelector<AppState, T>(selector, equalityFn);
}

export { useActions } from 'hooks';