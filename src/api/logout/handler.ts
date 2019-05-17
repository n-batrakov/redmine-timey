import { RegisterHandler } from '../../server/shared';
import { metadata } from './contract';
import { cookieName, cookieOptions } from '../../server/authSettings';


const signOutHandler: RegisterHandler = server => server.route({
    ...metadata,
    handler: async (_, resp) => {
        resp.setCookie(cookieName, '_', {
            ...cookieOptions,
            expires: new Date(0),
        });

        return '';
    },
});

export default signOutHandler;