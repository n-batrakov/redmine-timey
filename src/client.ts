import { TimesheetEntry, EnumerationsLookup, Issue } from './shared/types';
import { EntityList } from './shared/dataSource';

const isSuccessStatusCode = (response: Response) => response.status >= 200 && response.status < 300;
const ensureSuccessStatusCode = (response: Response, message?: string) => {
    if (isSuccessStatusCode) {
        return;
    } else {
        throw new Error(`Response status code ${response.status} does not indicate success. ${message || ''}`);
    }
}

export async function logout() {
    const x = await fetch('/api/logout', { method: 'POST' });

    if (x.status === 401) {
        return;
    }

    throw new Error(`Unable to log out. Status code must be Not Authorized (401) but ${x.status} received.`);
}


export async function addTimeEntries(entries: TimesheetEntry[]): Promise<Array<TimesheetEntry>> {
    const response = await fetch('/api/time', {
        method: 'POST',
        body: JSON.stringify(entries),
        headers: { 'Content-Type': 'application/json' },
    });
    ensureSuccessStatusCode(response);

    return await response.json();
}

export async function deleteTimeEntry(entryId: string) {
    const response = await fetch(`/api/time/${entryId}`, { method: 'DELETE' });

    ensureSuccessStatusCode(response);
}

export async function updateTimeEntry(entry: TimesheetEntry) {
    const response = await fetch('/api/time', {
        method: 'PUT',
        body: JSON.stringify(entry),
        headers: { 'Content-Type': 'application/json' },
    });

    ensureSuccessStatusCode(response);
}

export async function queryTimeEntries(start: Date, end: Date) {
    const response = await fetch(`/api/time?start=${start.toISOString()}&end=${end.toISOString()}`);
    ensureSuccessStatusCode(response);

    const body = await response.json();

    const data: TimesheetEntry[] = body.data.map((item: any) => {
        const { spentOn, ...rest } = item;
        return <TimesheetEntry>{
            ...rest,
            spentOn: new Date(Date.parse(spentOn)),
        };
    });

    return data;
}

export async function fetchHours(start: Date, end: Date) {
    const response = await fetch(`/api/time/hours?start=${start.toISOString()}&end=${end.toISOString()}`);
    ensureSuccessStatusCode(response);

    const body = await response.json();

    const result = body.map((x: any) => {
        const date = new Date(Date.parse(x.date));
        const count = x.count;

        return { date, count };
    });

    return <Array<{ date: Date, count: number}>>result;
}

export async function getMonthNorm() {
    const response = await fetch('/api/time/norm');
    ensureSuccessStatusCode(response);

    const data = await response.json();
    return <number>data.norm;
}

let enumerationsCache: EnumerationsLookup | undefined = undefined;
export async function getEnumerations(): Promise<EnumerationsLookup> {
    if (enumerationsCache === undefined) {
        const response = await fetch('/api/enumerations');
        ensureSuccessStatusCode(response);

        enumerationsCache = (await response.json()) as EnumerationsLookup;
    }

    return enumerationsCache;
}


export async function getIssues(params: { limit: number, offset: number }): Promise<EntityList<Issue>> {
    const response = await fetch(`/api/issue?limit=${params.limit}&offset=${params.offset}`);
    ensureSuccessStatusCode(response);

    return await response.json();
}