import { RegisterHandler } from 'server/shared';
import { cookieName, cookieOptions } from 'server/authSettings';
import { metadata } from './contract';


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