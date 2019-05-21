import { TimingsPageAction, TimingsPageState } from '../containers/timings/types';
import { ActivityListAction, ActivityListState } from '../containers/activityList/types';
import { EnumerationsAction, EnumerationsState } from '../containers/enumerations/types';
import { IssuesAction, IssuesState } from '../containers/issues/types';
import { AuthAction, AuthState } from '../containers/login/types';

export type AppState = {
        enumerations: EnumerationsState,
    } & {
        timingsPage: TimingsPageState,
    } & {
        activityList: ActivityListState,
    } & {
        issues: IssuesState,
    } & {
        auth: AuthState,
    };


export type AppAction =
    TimingsPageAction |
    ActivityListAction |
    EnumerationsAction |
    IssuesAction |
    AuthAction;