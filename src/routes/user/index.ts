import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { FastifyInstance } from 'fastify'

const userRoute = async (fastify: FastifyInstance) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .get('/me', async (request, reply) => {})
}

export default userRoute
