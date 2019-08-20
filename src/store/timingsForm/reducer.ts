import { TimingsFormState, TimingsFormAction } from './types';
import { assertNever } from '../../shared';

export const initialState: TimingsFormState = {
    success: false,
    loading: false,
    error: undefined,
};

export const reducer = (state: TimingsFormState, action: TimingsFormAction): TimingsFormState => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case 'timingForm_loading':
            return { loading: true, error: undefined, success: false };
        case 'timingsForm_error':
            return { loading: false, error: action.error, success: false };
        case 'timingsForm_success':
            return { loading: false, error: undefined, success: true };
        default:
            assertNever(action);
            return state;
    }
};