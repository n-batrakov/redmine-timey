import { TimesheetEntry, IncomingTimesheetEntry } from '../../shared/types';
import { TimingsFormThunk, TimingsFormAction } from './types';
import { addTimings } from '../../api/addTimings';
import { updateTiming } from '../../api/updateTiming';
import { AppAction, AppState } from '..';
import { ThunkDispatch } from '../thunk';
import { fetchTiming } from '../../api/fetchTiming';
import { deleteTiming } from '../../api/deleteTiming';
import { addEntry, updateEntry } from '../activityList/actions';

export const selectEntry = (entry: TimesheetEntry): TimingsFormAction => ({
    entry,
    type: 'timing_setEntry',
});

export const loadTimesheetEntry = (entryId: string): TimingsFormThunk => async (dispatch) => {
    dispatch({ type: 'timing_loading' });

    const response = await fetchTiming(entryId);

    switch (response.code) {
        case 'Success':
            dispatch({ entry: response.data, type: 'timing_setEntry' });
            break;
        case 'Error':
            dispatch({ type: 'timing_error', error: response.message });
            break;
        default:
            throw new Error('[BUG] Unexpected case');
    }
};

export const addTimesheetEntry = (entry: IncomingTimesheetEntry): TimingsFormThunk =>
    async (dispatch: ThunkDispatch<AppState, {}, AppAction>) => {
        dispatch({ type: 'timing_loading' });

        if (!isValidEntry(entry)) {
            dispatch({ type: 'timing_error', error: 'Oops! Looks like there\'s a bug in our system' });
            return;
        }

        const [response] = await addTimings([entry]);

        switch (response.code) {
            case 'Success':
                dispatch(addEntry(entry));
                dispatch({ type: 'timing_success' });
                break;
            case 'Error':
                console.error(response);
                dispatch({ type: 'timing_error', error: 'An error occured while saving your timing. Please, try again later' });
                break;
        }
    };

export const updateTimesheetEntry = (entry: TimesheetEntry): TimingsFormThunk =>
    async (dispatch: ThunkDispatch<AppState, {}, AppAction>) => {
        dispatch({ type: 'timing_loading' });

        try {
            await updateTiming(entry);
            dispatch(updateEntry(entry));
            dispatch({ type: 'timing_success' });
        } catch (e) {
            console.error(e);
            dispatch({ type: 'timing_error', error: 'An error occured while saving your timing. Please, try again later' });
        }
    };

export const deleteTimesheetEntry = (entryId: string): TimingsFormThunk =>
    async (dispatch: ThunkDispatch<AppState, {}, AppAction>) => {
        dispatch({ type: 'timing_loading' });

        try {
            await deleteTiming(entryId);
            dispatch({ type: 'timing_removeEntry' });
        } catch (e) {
            console.error(e);
            dispatch({ type: 'timing_error', error: 'An error occured while deleting your timing. Please, try again later' });
        }
    };

const requiredProps = ['issue', 'activity', 'spentOn', 'hours', 'comments'];
function isValidEntry(entry?: Partial<TimesheetEntry>): entry is TimesheetEntry {
        const validateProp = (x?: any) => {
            switch (typeof x) {
                case 'number':
                case 'string':
                case 'boolean':
                    return true;
                case 'object':
                    if (x instanceof Date) return true;
                    return x.id !== undefined;
                default:
                    return false;
            }
        };

        if (entry === undefined) {
            return false;
        }

        const invalidProps = requiredProps
            .map<[string, any]>(key => [key, (entry as any)[key]])
            .filter(([_, value]) => !validateProp(value))
            .map(([key]) => key);

        if (invalidProps.length === 0) {
            return true;
        } else {
            console.error('[BUG] Invalid time entry. The following properties are invalid', invalidProps);
            return false;
        }
    }