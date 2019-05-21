export class ServerError extends Error {
    public static readonly Name: string = 'ServerError';
    public readonly status: number;

    constructor(statusCode: number) {
        super();

        this.name = ServerError.Name;
        this.message = `Response status code (${statusCode}) does not indicate success`;
        this.status = statusCode;
    }
}

export class NotAuthorizedError extends Error {
    public static readonly Name: string = 'NotAuthorizedError';

    constructor() {
        super();
        this.name = NotAuthorizedError.Name;
        this.message = 'Current user is not authorized to access resource. Client session does not exists or invalid.';
    }
}

export class ForbiddenError extends Error {
    public static readonly Name: string = 'ForbiddenError';

    constructor() {
        super();

        this.name = ForbiddenError.Name;
        this.message = 'Current user is not allowed to access resoure. User have not enough privelege.';
    }
}