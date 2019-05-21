import schema from '../schema';
import { toISODate } from './date';

export type NamedId = {id: string, name?: string, href?: string};

export type TimesheetEntry = {
    id: string,
    project: NamedId,
    issue?: NamedId,
    user: NamedId,
    activity: NamedId,
    hours: number,
    comments: string,
    spentOn: Date,
};

export const isNamedIdEqual = (a?: NamedId, b?: NamedId) => {
    if (a === b) {
        return true;
    }
    if (a === undefined) {
        return b === undefined;
    }
    if (b === undefined) {
        return a === undefined;
    }
    return a.id === b.id && a.name === b.name;
};

export const isTimesheetEntryEqual = (a?: TimesheetEntry, b?: TimesheetEntry) => {
    if (a === b) {
        return true;
    }
    if (a === undefined) {
        return b === undefined;
    }
    if (b === undefined) {
        return a === undefined;
    }

    return b.id === a.id &&
        b.hours === a.hours &&
        b.comments === a.comments &&
        toISODate(b.spentOn) === toISODate(a.spentOn) &&
        isNamedIdEqual(b.project, a.project) &&
        isNamedIdEqual(b.issue, a.issue) &&
        isNamedIdEqual(b.activity, a.activity) &&
        isNamedIdEqual(b.user, a.user);
};




const nameIdSchema = schema.object(
    { id: schema.string(), name: schema.string() },
    schema.required('id'),
);

export const TimesheetEntrySchema = schema.object({
    id: schema.string(),
    project: nameIdSchema,
    issue: nameIdSchema,
    user: nameIdSchema,
    activity: nameIdSchema,
    hours: schema.float(),
    comments: schema.string(),
    spentOn: schema.dateTime(),
});



export type Issue = {
    id: string,
    subject: string,
    description: string,
    createdOn: Date,
    updatedOn: Date,

    project: NamedId,
    status: NamedId,
    priority: NamedId,
    author: NamedId,
    assignedTo?: NamedId,

    parent?: NamedId,

    href: string,
};

export type Enumeration = {
    defaultValue: string,
    values: {
        [id: string]: string,
    },
};
export type EnumerationsLookup = {
    priority: Enumeration,
    status: Enumeration,
    activity: Enumeration,
    projects: Enumeration,
    queries: Enumeration,
    users: Enumeration,
};

export type UserSession = {
    username: string,
};