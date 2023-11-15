import { JSONSchemaType, envSchema } from 'env-schema';

interface Env {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

/**
 * We only use fastify's internal type validation
 */
const schema: JSONSchemaType<Env> = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    PORT: {
      type: 'number',
      default: 5000,
    },
    DATABASE_URL: {
      type: 'string',
      default: 'postgres://postgres:postgres@localhost:5432/postgres',
    },
    JWT_SECRET: {
      type: 'string',
      default: 'secret',
    },
    JWT_EXPIRES_IN: {
      type: 'string',
      default: '15m',
    },
  },
};

export const env = envSchema({ schema, dotenv: true });
