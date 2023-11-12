import fp from 'fastify-plugin'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { PaginationQuerySchema, PaginationResponseSchema } from '../shared'
import { TodoSchema, UpdateTodoSchema } from './schema'

const todoRoute = fp(async (fastify) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .get(
      '/todos',
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
      '/todos',
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

        reply.send(todo)
      },
    )
    .put(
      '/todos/:id',
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
          },
        })

        reply.send(todo)
      },
    )
    .delete(
      '/todos/:id',
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

        reply.send({ message: 'ok' })
      },
    )
})

export default todoRoute
