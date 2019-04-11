import { TimingsPageState } from './pages/timings/types';
import { SharedState } from './pages/shared/store';
import { ActivityListState } from './pages/activityList/types';

export type AppState =
    SharedState & {
        timingsPage: TimingsPageState,
    } & {
        activityList: ActivityListState,
    };