import { RequestMetadata } from '../../shared/http';
import { UserSession } from '../../shared/types';

export const metadata: RequestMetadata = {
    method: 'GET',
    url:'/api/session',
};

export type GetSessionResponse = UserSession;