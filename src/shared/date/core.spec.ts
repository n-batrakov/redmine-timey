import { addDays } from './core';

describe('addDays', () => {
    const addDaysTestData: Array<[number, number, number]> = [
        [+1, Date.UTC(2018, 11, 31), Date.UTC(2019, 0,  1)],
        [+2, Date.UTC(2019, 0, 1), Date.UTC(2019, 0, 3)],
        [-1, Date.UTC(2019, 0, 1), Date.UTC(2018, 11, 31)],
        [+10, Date.UTC(2019, 0, 1), Date.UTC(2019, 0, 11)],
        [+10, Date.UTC(2019, 0, 22), Date.UTC(2019, 1, 1)],
        [+365, Date.UTC(2019, 0, 1), Date.UTC(2020, 0, 1)],
    ];

    addDaysTestData.forEach(([days, init, expected]) => {
        it(`can add ${days} to ${new Date(init).toDateString()}`, () => {
            const actual = addDays(new Date(init), days);

            expect(actual).toEqual(new Date(expected));
        });
    });
});