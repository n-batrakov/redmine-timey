import { RequestMetadata } from 'shared/http';
import schema from 'shared/schema';
import { UserSession } from 'shared/types';

export const metadata: RequestMetadata = {
    method: 'POST',
    url:'/api/login',
    schema: {
        body: schema.object(
            {
                login: schema.string(),
                password: schema.string(),
            },
            {
                required: ['login', 'password'],
            },
        ),
    },
};

export type LoginRequest = {
    login: string,
    password: string,
};

export type LoginResponse = UserSession;