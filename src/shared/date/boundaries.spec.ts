import { getMonthBoundaries } from './boundaries';

describe('boundaries', () => {
    const testDate: Array<[number, [number, number]]> = [
        [Date.UTC(2018, 11, 15), [Date.UTC(2018, 11, 1), Date.UTC(2019, 0,  1)]],
        [Date.UTC(2019, 2, 15), [Date.UTC(2019, 2, 1), Date.UTC(2019, 3, 1)]],
    ];

    testDate.forEach(([date, [expectedStart, expectedEnd]]) => {
        it(`can get range for ${new Date(date)}`, () => {
            const expected = [new Date(expectedStart), new Date(expectedEnd)];
            const actual = getMonthBoundaries(new Date(date));

            expect(actual).toEqual(expected);
        });
    });
});