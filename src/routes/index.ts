import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import authRoute from './auth'
import pingRoute from './ping'
import todosRoute from './todos'

const routes: FastifyPluginAsync = fp(async (fastify) => {
  fastify
    .register(authRoute, { prefix: '/auth' })
    .register(pingRoute, { prefix: '/ping' })
    .register(todosRoute, { prefix: '/todos' })
})

export default routes
