import { useSelector } from 'react-redux';
import { ActivityListAction, ActivityListState } from 'features/activityOverview/state/activityList/types';
import { EnumerationsAction, EnumerationsState } from 'features/enumerations/state/types';
import { IssuesAction, IssuesState } from 'features/timeEntry/state/issues/types';
import { AuthAction, AuthState } from 'features/auth/state/types';
import { TimingsFormAction, TimingsFormState } from 'features/timeEntry/state/timing/types';
import { CalendarState, CalendarAction } from 'features/activityOverview/state/calendar/types';
import { HoursGaugeState, HoursGaugeActions } from 'features/activityOverview/state/hoursGauge/types';

export { ThunkAction, ThunkDispatch, ThunkErrorHandler } from './thunk';

export type AppState = {
    enumerations: EnumerationsState,
    timingsForm: TimingsFormState,
    activityList: ActivityListState,
    hoursGauge: HoursGaugeState,
    calendar: CalendarState,
    issues: IssuesState,
    auth: AuthState,
};


export type AppAction =
    | TimingsFormAction
    | ActivityListAction
    | HoursGaugeActions
    | CalendarAction
    | EnumerationsAction
    | IssuesAction
    | AuthAction
    ;


export function useAppState<T>(selector: (s: AppState) => T, equalityFn?: (a: T, b: T) => boolean): T {
    return useSelector<AppState, T>(selector, equalityFn);
}

export { useActions } from 'hooks';