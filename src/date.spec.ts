import { addDays, getRange } from './date';

describe('addDays', () => {
    const addDaysTestData: Array<[number, number, number]> = [
        [+1, Date.UTC(2018, 11, 31), Date.UTC(2019, 0,  1 )],
        [+2, Date.UTC(2019, 0,  1 ), Date.UTC(2019, 0 , 3 )],
        [-1, Date.UTC(2019, 0,  1 ), Date.UTC(2018, 11, 31)],
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

describe('getRange', () => {
    it('can generate sequence', () => {
        const start = new Date(Date.UTC(2019, 0, 1));
        const end = new Date(Date.UTC(2019, 0, 10));
        const expected = new Array(10).fill(undefined).map((_, i) => new Date(Date.UTC(2019, 0, i + 1)));

        const actual = Array.from(getRange(start, end));

        expect(actual).toEqual(expected);
    });

    it('can generate sequence across months', () => {
        const start = new Date(Date.UTC(2018, 11, 31));
        const end = new Date(Date.UTC(2019, 0, 2));
        const expected = [Date.UTC(2018, 11, 31), Date.UTC(2019, 0, 1), Date.UTC(2019, 0, 2)].map(x => new Date(x));

        const actual = Array.from(getRange(start, end));

        expect(actual).toEqual(expected);
    });
});