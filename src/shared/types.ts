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