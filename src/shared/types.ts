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

const stringSchema = { type: 'string' };
const floatSchema = { type: 'number' };
const dateTimeSchema = { type: 'string', format: 'date-time' };

const nameIdSchema = {
    type: 'object',
    required: [ 'id' ],
    properties: {
        id: stringSchema,
        name: stringSchema,
    },
};

export const TimesheetEntrySchema = {
    type: 'object',
    properties: {
        id: stringSchema,
        project: nameIdSchema,
        issue: nameIdSchema,
        user: nameIdSchema,
        activity: nameIdSchema,
        hours: floatSchema,
        comments: stringSchema,
        spentOn: dateTimeSchema,
    },
};



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
};