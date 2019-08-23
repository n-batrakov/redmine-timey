import { TimingsFormState, TimingsFormAction } from './types';
import { assertNever } from '../../shared';

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
        case 'timingForm_loading':
            return { ...state, loading: true, error: undefined, success: false };
        case 'timingsForm_error':
            return { ...state, loading: false, error: action.error, success: false };
        case 'timingsForm_success':
            return { ...state, loading: false, error: undefined, success: true };
        case 'timingForm_setEntry':
            return {
                ...state,
                loading: false,
                error: undefined,
                success: false,
                entry: action.entry,
            };
        case 'timingForm_removeEntry':
            return { ...state, loading: false, error: undefined, success: true, entry: undefined };
        default:
            assertNever(action);
            return state;
    }
};
