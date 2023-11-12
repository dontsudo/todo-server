import { envSchema, JSONSchemaType } from 'env-schema'

interface Env {
  PORT: number
  DATABASE_URL: string
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
      default: 'mongodb://localhost:27017',
    },
  },
}

export const env = envSchema({ schema, dotenv: true })
