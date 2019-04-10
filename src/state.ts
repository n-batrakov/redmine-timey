import { TimingsPageState } from './pages/timings/types';
import { SharedState } from './pages/shared/store';

export type AppState = TimingsPageState & SharedState;