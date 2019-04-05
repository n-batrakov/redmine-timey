import { RequestMetadata } from '../shared';

export const metadata: RequestMetadata = {
    url: '/api/time/norm',
    method: 'GET',
};

export type GetMonthNormResponse = {
    norm: number,
};