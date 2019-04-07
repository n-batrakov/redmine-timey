import { RequestMetadata } from '../../shared/http';

export const formatUrl = (id: string) => `/api/time/${id}`;

export const metadata: RequestMetadata = {
    method: 'DELETE',
    url: '/api/time/:id',
};