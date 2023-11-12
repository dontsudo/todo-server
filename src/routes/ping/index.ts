import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const pingRoute: FastifyPluginAsync = fp(async (fastify) => {
  fastify.get('/ping', async (request, reply) => {
    reply.send({ ping: 'pong' })
  })
})

export default pingRoute
