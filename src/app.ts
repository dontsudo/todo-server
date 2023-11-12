import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import routes from './routes'
import prismaPlugin from './plugins/prisma'

const init = async () => {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  fastify.get('/', async function (request, reply) {
    reply.send({
      message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    })
  })

  fastify.register(prismaPlugin)
  fastify.register(routes)

  return fastify
}

export { init }
