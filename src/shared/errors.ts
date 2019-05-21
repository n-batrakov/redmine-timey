export class NotAuthorizedError extends Error {
    public static readonly Name: string = 'NotAuthorizedError';

    constructor() {
        super();
        this.name = NotAuthorizedError.Name;
        this.message = 'Current user is not authorized to access resource. Client session does not exists or invalid.';
    }
}