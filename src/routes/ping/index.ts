import { FastifyInstance } from 'fastify'

const pingRoute = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    reply.send({ ping: 'pong' })
  })
}

export default pingRoute
