import { EnumerationsLookup } from '../../shared/types';
import { RequestMetadata } from '../shared';

export const metadata: RequestMetadata = {
    url: '/api/enumerations',
    method: 'GET',
};

export type GetEnumerationsResponse = EnumerationsLookup;