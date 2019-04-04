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