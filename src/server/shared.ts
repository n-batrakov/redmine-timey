import fastify from 'fastify';
import { RedmineClient } from './redmine';
import { Calendar } from './workHoursNorm';

export type AppContainer = {
    redmine: RedmineClient,
    calendar: Calendar,
};

export type RegisterHandler = (server: fastify.FastifyInstance, container: AppContainer) => void;