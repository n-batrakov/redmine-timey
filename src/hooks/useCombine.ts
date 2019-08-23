import { notNullOrUndefined } from '../shared';
import { useCallback } from 'react';



export function useCombine<T extends (...args: any[]) => void>(functions: Array<T | undefined>, deps: any[] = []): T {
    return useCallback(combine(functions), deps);
}

export function combine<Fn extends (...args: any[]) => void>(functions: Array<Fn | undefined>): Fn {
    const fns = functions.filter(notNullOrUndefined);

    const sum: any = (...args: any[]): void => {
        fns.forEach(fn => fn(...args));
    };

    return sum;
}