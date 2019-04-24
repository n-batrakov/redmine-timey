import { TimingsPageState } from './containers/timings/types';
import { SharedState } from './containers/shared/types';
import { ActivityListState } from './containers/activityList/types';
import { IssuesState } from './containers/issues/types';

export type AppState =
    SharedState & {
        timingsPage: TimingsPageState,
    } & {
        activityList: ActivityListState,
    } & {
        issues: IssuesState,
    };