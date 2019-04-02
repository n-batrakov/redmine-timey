import { Enumeration, NamedId } from './types';

export const assertNever = (_: never) => {};

export const toArray = (enumeration: Enumeration): NamedId[] => {
    return Object.entries(enumeration.values).map(([id, name]) => ({ id, name }));
};