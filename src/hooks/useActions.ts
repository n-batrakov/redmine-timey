import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

type Fn = (...args: any[]) => void;

export function useActions<T extends Fn>(fn: T, deps?: any[]): T;
export function useActions<T extends { [key: string]: Fn}>(obj: T, deps?: any[]): T;
export function useActions<T extends Array<Fn>>(arr: T, deps?: any[]): T;

export function useActions(arg: any, deps: any[] = []) {
    switch (typeof arg) {
        case 'function':
            return bindFunction(arg, deps);
        case 'object':
            return Array.isArray(arg) ? bindArray(arg, deps) : bindObject(arg, deps);
        default:
            throw new Error('Unexpected argument type. Argument must be [Function], [Array] or plain [Object].');
    }
}

function bindFunction(fn: Fn, deps: any[]): Fn {
    const dispatch = useDispatch();

    const result: any = useCallback((...args: any[]) => dispatch(fn(...args)), deps);

    return result;
}

function bindObject(obj: { [key: string]: Fn }, deps: any[]): { [key: string]: Fn } {
    return Object
    .entries(obj)
    .map(([key, value]) => {
        return [key, bindFunction(value, deps)] as [string, (...args: any[]) => void];
    })
    .reduce(
        (acc, [key, value]) => {
            acc[key] = value;
            return acc;
        },
        {} as any,
    );
}

function bindArray(arr: Fn[], deps: any[]): Fn[] {
    return arr.map(x => bindFunction(x, deps));
}