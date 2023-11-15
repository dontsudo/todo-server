import argon from 'argon2'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { CreateUserSchema, UserWithoutPasswordSchema } from '../user/schema'
import { ErrorSchema } from '../errors'
import { LoginSchema } from './schema'
import { FastifyInstance } from 'fastify'

const authRoute = async (fastify: FastifyInstance) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .post(
      '/sign-up',
      {
        schema: {
          body: CreateUserSchema,
          response: {
            '200': UserWithoutPasswordSchema,
            '400': ErrorSchema,
          },
        },
      },
      async (request, reply) => {
        const { name, email, password } = request.body
        const userExists = await fastify.prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (userExists) {
          return reply.status(400).send({
            message: 'User already exists',
          })
        }

        const hashedPassword = await argon.hash(password, {
          type: argon.argon2id,
        })
        const user = await fastify.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })

        reply.send(user)
      },
    )
    .post(
      '/sign-in',
      {
        schema: {
          body: LoginSchema,
          response: {
            '200': UserWithoutPasswordSchema,
            '400': ErrorSchema,
          },
        },
      },
      async (request, reply) => {
        const { email, password } = request.body

        const user = await fastify.prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!user) {
          return reply.status(400).send({
            message: 'User not found',
          })
        }

        const passwordMatches = await argon.verify(user.password, password)

        if (!passwordMatches) {
          return reply.status(400).send({
            message: 'Password does not match',
          })
        }

        reply.send(user)
      },
    )
}

export default authRoute
