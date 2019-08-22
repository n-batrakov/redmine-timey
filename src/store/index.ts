import { TimingsPageAction, TimingsPageState } from './timingsPage/types';
import { ActivityListAction, ActivityListState } from './activityList/types';
import { EnumerationsAction, EnumerationsState } from './enumerations/types';
import { IssuesAction, IssuesState } from './issues/types';
import { AuthAction, AuthState } from './auth/types';
import { TimingsFormAction, TimingsFormState } from './timingsForm/types';
import { useSelector } from 'react-redux';

export type AppState = {
        enumerations: EnumerationsState,
    } & {
        timingsPage: TimingsPageState,
    } & {
        timingsForm: TimingsFormState,
    } & {
        activityList: ActivityListState,
    } & {
        issues: IssuesState,
    } & {
        auth: AuthState,
    };


export type AppAction =
    TimingsPageAction |
    TimingsFormAction |
    ActivityListAction |
    EnumerationsAction |
    IssuesAction |
    AuthAction;


export function useAppState<T>(selector: (s: AppState) => T, equalityFn?: (a:T, b:T) => boolean): T {
        return useSelector<AppState, T>(selector, equalityFn);
    }