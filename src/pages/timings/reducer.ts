import { TimingsPageState, TimingsPageAction } from './types';

const initialState: TimingsPageState = {
    gauge: undefined,
    heatmap: undefined,
};

export const reducer = (state: TimingsPageState, action: TimingsPageAction): TimingsPageState => {
    if (state === undefined) return initialState;

    switch (action.type) {
        case 'timings_setData':
            return { ...state, ...action.data };
        default:
            return state;
    }
};