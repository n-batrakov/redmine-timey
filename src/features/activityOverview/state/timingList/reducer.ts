import { TimingsPageState, TimingsPageAction } from './types';

export const initialState: TimingsPageState = {
    gauge: undefined,
    heatmap: undefined,
    isLoading: true,
};

export const reducer = (state: TimingsPageState, action: TimingsPageAction): TimingsPageState => {
    if (state === undefined) return initialState;

    switch (action.type) {
        case 'timings_setData':
            return { ...state, ...action.data, isLoading: false };
        case 'timings_setLoader':
            return { ...state, isLoading: true };
        default:
            return state;
    }
};