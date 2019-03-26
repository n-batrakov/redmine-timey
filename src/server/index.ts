import { RedmineClient } from './redmine';
import fastify from 'fastify';
import staticFiles from 'fastify-static';
import api from './api';
import path from 'path';
import fs from 'fs';
import { AppContainer } from './api/shared';
import { getCalendar } from './workHoursNorm';

(async function () {
    const server = fastify({ logger: true });

    const container: AppContainer = {
        redmine: new RedmineClient({ host: 'https://rm.itexpert.ru' }),
        calendar: await getCalendar('calendar.csv'),
    };

    api.forEach(addRoute => addRoute(server, container));

    const staticPath = path.join(__dirname, '..', 'public');
    if (fs.existsSync(staticPath)) {
        server.register(staticFiles, { root: staticPath });
    }

    try {
        await server.listen(3000);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();