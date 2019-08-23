import { Enumeration, NamedId } from './types';

export const assertNever = (_: never) => {};

export const toArray = (enumeration: Enumeration): NamedId[] => {
    return Object.entries(enumeration.values).map(([id, name]) => ({ id, name }));
};

export const bind = (fn: ((...args: any[]) => any) | undefined, ...args: any[]) => {
    if (fn === undefined) {
        return undefined;
    }
    return fn.bind(undefined, ...args);
};

export const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined;
}

export function notNullOrUndefined<T>(value: T | null |undefined): value is T {
    return value !== undefined && value !== null;
}
