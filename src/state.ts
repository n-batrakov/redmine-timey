import { TimingsPageState } from './containers/timings/types';
import { EnumerationsState } from './containers/enumerations/types';
import { ActivityListState } from './containers/activityList/types';
import { IssuesState } from './containers/issues/types';
import { AuthState } from './containers/login/types';

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