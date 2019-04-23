import { RedmineClient } from './redmine';
import fastify from 'fastify';
import staticFiles from 'fastify-static';
import path from 'path';
import fs from 'fs';

import api from './api';
import { AppContainer } from './shared';
import { getCalendar } from './workHoursNorm';
import { fallback } from './middleware/fallback';


(async function () {
    const server = fastify({ logger: true });

    const container: AppContainer = {
        redmine: new RedmineClient({ host: 'https://rm.itexpert.ru' }),
        calendar: await getCalendar('calendar.csv'),
    };

    api.forEach(addRoute => addRoute(server, container));

    if (process.env.NODE_ENV !== 'production') {
        const { devServer } = require('./middleware/devServer');
        server.use(devServer());
    } else {
        const staticPath = path.join(__dirname, 'public');
        if (fs.existsSync(staticPath)) {
            server.use(fallback(path.join(staticPath, 'index.html')));
            server.register(staticFiles, {
                root: staticPath,
                cacheControl: true,
                maxAge: '30d',
                immutable: true,
            });
        }
    }

    try {
        await server.listen(8081, '0.0.0.0');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();

