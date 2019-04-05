import schema from '../schema';

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



const nameIdSchema = schema.object(
    { id: schema.string(), name: schema.string() },
    schema.required('id', 'name'),
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
};