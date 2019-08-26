import { assertNever } from 'shared/utils';
import { TimingsFormState, TimingsFormAction } from './types';

export const initialState: TimingsFormState = {
    success: false,
    loading: false,
    error: undefined,
    entry: undefined,
};

export const reducer = (state: TimingsFormState, action: TimingsFormAction): TimingsFormState => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case 'timing_loading':
            return { ...state, loading: true, error: undefined, success: false };
        case 'timing_error':
            return { ...state, loading: false, error: action.error, success: false };
        case 'timing_setEntry':
            return {
                ...state,
                loading: false,
                error: undefined,
                success: false,
                entry: action.entry,
            };
        case 'timing_addEntry':
        case 'timing_updateEntry':
            return { ...state, loading: false, error: undefined, success: true, entry: action.entry };
        case 'timing_removeEntry':
            return { ...state, loading: false, error: undefined, success: true, entry: undefined };
        case 'timing_reset':
            return initialState;
        default:
            assertNever(action);
            return state;
    }
};
