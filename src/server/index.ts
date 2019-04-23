import { RedmineClient } from './redmine';
import fastify from 'fastify';
import staticFiles from 'fastify-static';
import path from 'path';
import fs from 'fs';

import api from './api';
import { AppContainer } from './shared';
import { getCalendar } from './workHoursNorm';

import { devServer } from './middleware/devServer';

const ENV = 'DEBUG';

(async function () {
    const server = fastify({ logger: true });

    const container: AppContainer = {
        redmine: new RedmineClient({ host: 'https://rm.itexpert.ru' }),
        calendar: await getCalendar('calendar.csv'),
    };

    api.forEach(addRoute => addRoute(server, container));

    if (ENV === 'DEBUG') {
        server.use(devServer());
    } else {
        const staticPath = path.join(__dirname, '..', 'public');
        if (fs.existsSync(staticPath)) {
            server.register(staticFiles, { root: staticPath });
        }
    }

    try {
        await server.listen(8081, '0.0.0.0');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();

