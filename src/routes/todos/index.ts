import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { PaginationQuerySchema, PaginationResponseSchema } from '../shared'
import { TodoSchema, UpdateTodoSchema } from './schema'
import { FastifyInstance } from 'fastify'

const todosRoute = async (fastify: FastifyInstance) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .get(
      '/',
      {
        schema: {
          querystring: PaginationQuerySchema,
          response: {
            '200': PaginationResponseSchema(TodoSchema),
          },
        },
      },
      async (request, reply) => {
        const { offset = 0, limit = 10 } = request.query

        const todos = await fastify.prisma.todo.findMany({
          skip: offset,
          take: limit,
        })

        const total = await fastify.prisma.todo.count()

        reply.send({ data: todos, total, offset, limit })
      },
    )
    .post(
      '/',
      {
        schema: {
          body: Type.Object({
            title: Type.String(),
            description: Type.String(),
          }),
        },
      },
      async (request, reply) => {
        const body = request.body
        const todo = await fastify.prisma.todo.create({
          data: {
            title: body.title,
            description: body.description,
          },
        })

        reply.status(201).send(todo)
      },
    )
    .put(
      '/:id',
      {
        schema: {
          params: Type.Object({
            id: Type.String(),
          }),
          body: UpdateTodoSchema,
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const body = request.body

        const todo = await fastify.prisma.todo.update({
          where: { id },
          data: {
            title: body.title,
            description: body.description,
            done: body.done,
          },
        })

        reply.send(todo)
      },
    )
    .delete(
      '/:id',
      {
        schema: {
          params: Type.Object({
            id: Type.String(),
          }),
        },
      },
      async (request, reply) => {
        const { id } = request.params

        await fastify.prisma.todo.delete({
          where: {
            id,
          },
        })

        reply.status(204).send({ message: 'ok' })
      },
    )
}

export default todosRoute
