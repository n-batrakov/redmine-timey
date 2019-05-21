import { TimingsPageAction, TimingsPageState } from './timingsPage/types';
import { ActivityListAction, ActivityListState } from './activityList/types';
import { EnumerationsAction, EnumerationsState } from './enumerations/types';
import { IssuesAction, IssuesState } from './issues/types';
import { AuthAction, AuthState } from './auth/types';

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