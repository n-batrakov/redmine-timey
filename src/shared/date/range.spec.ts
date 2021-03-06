import { dateRange } from './range';

describe('getRange', () => {
    it('can generate sequence', () => {
        const start = new Date(Date.UTC(2019, 0, 1));
        const end = new Date(Date.UTC(2019, 0, 10));
        const expected = new Array(10).fill(undefined).map((_, i) => new Date(Date.UTC(2019, 0, i + 1)));

        const actual = Array.from(dateRange(start, end));

        expect(actual).toEqual(expected);
    });

    it('can generate sequence across months', () => {
        const start = new Date(Date.UTC(2018, 11, 31));
        const end = new Date(Date.UTC(2019, 0, 2));
        const expected = [Date.UTC(2018, 11, 31), Date.UTC(2019, 0, 1), Date.UTC(2019, 0, 2)].map(x => new Date(x));

        const actual = Array.from(dateRange(start, end));

        expect(actual).toEqual(expected);
    });

    it('can generate sequence with step 2', () => {
        const start = new Date(Date.UTC(2018, 11, 31));
        const end = new Date(Date.UTC(2019, 0, 4));
        const expected = [Date.UTC(2018, 11, 31), Date.UTC(2019, 0, 2), Date.UTC(2019, 0, 4)].map(x => new Date(x));

        const actual = Array.from(dateRange(start, end, 2));

        expect(actual).toEqual(expected);
    });

    it('can generate reverse range', () => {
        const start = new Date(Date.UTC(2018, 11, 31));
        const end = new Date(Date.UTC(2019, 0, 2));
        const expected = [Date.UTC(2019, 0, 2), Date.UTC(2019, 0, 1), Date.UTC(2018, 11, 31)].map(x => new Date(x));

        const actual = Array.from(dateRange(end, start, -1));

        expect(actual).toEqual(expected);
    });

    it('can generate single date range', () => {
        const start = new Date(Date.UTC(2019, 2, 25));
        const end = new Date(Date.UTC(2019, 2, 25));
        const expected = [new Date(Date.UTC(2019, 2, 25))];

        const actual = Array.from(dateRange(end, start));

        expect(actual).toEqual(expected);
    });
});