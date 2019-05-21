import { Action } from 'redux';

export interface ThunkDispatch<TState, TExtra, TAction extends Action> {
    <T extends TAction>(action: T): T;
    <TResult>(asyncAction: ThunkAction<TResult, TState, TExtra, TAction>): TResult;
}

export type ThunkAction<TResult, TState, TExtra, TAction extends Action> = (
    dispatch: ThunkDispatch<TState, TExtra, TAction>,
    getState: () => TState,
) => TResult;

export type ThunkErrorHandler<TState, TExtra, TAction extends Action> = (
    error: Error,
    dispatch: ThunkDispatch<TState, TExtra, TAction>,
    getState: () => TState,
) => void;

export function createThunkMiddleware<TState, TExtra, TAction extends Action>(handler: ThunkErrorHandler<TState, TExtra, TAction>) {
    return ({ dispatch, getState }: any) => (next: any) => (action: any) => {
        if (typeof action === 'function') {
            try {
                const result = action(dispatch, getState);
                if (result !== undefined && result instanceof Promise) {
                    result.catch((err: any) => handler(err, dispatch, getState));
                }

                return result;
            } catch (e) {
                handler(e, dispatch, getState);
            }
        }

        return next(action);
    };
}