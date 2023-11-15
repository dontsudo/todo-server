import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';

import { guardPlugin } from '../../plugins/guard';
import { ErrorSchema } from '../errors';
import { PaginationQuerySchema, PaginationResponseSchema } from '../shared';
import { CreateTodoSchema, TodoSchema, UpdateTodoSchema } from './schema';

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
        const { offset = 0, limit = 10 } = request.query;

        const todos = await fastify.prisma.todo.findMany({
          skip: offset,
          take: limit,
        });

        const total = await fastify.prisma.todo.count();

        reply.send({ data: todos, total, offset, limit });
      },
    )
    .get(
      '/:id',
      {
        schema: {
          params: Type.Object({
            id: Type.String(),
          }),
          response: {
            '200': TodoSchema,
            '400': ErrorSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params;

        const todo = await fastify.prisma.todo.findUnique({
          where: {
            id,
          },
        });

        if (!todo) {
          reply.status(404).send({ message: 'Not found' });
          return;
        }

        reply.send(todo);
      },
    );

  // 🔐 authorized route
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .register(guardPlugin)
    .post(
      '/',
      {
        schema: {
          body: CreateTodoSchema,
        },
      },
      async (request, reply) => {
        const { title, description } = request.body;
        const { id: userId } = request.user;

        const todo = await fastify.prisma.todo.create({
          data: {
            title,
            description,
            userId,
          },
        });

        reply.status(201).send(todo);
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
        const { id } = request.params;
        const { title, description, done } = request.body;
        const { id: userId } = request.user;

        const todo = await fastify.prisma.todo.findFirst({
          where: {
            id,
          },
        });

        if (!todo) {
          reply.status(404).send({ message: 'Not found' });
          return;
        }

        if (todo.userId !== userId) {
          reply.status(403).send({ message: 'Forbidden' });
          return;
        }

        const updatedTodo = await fastify.prisma.todo.update({
          where: {
            id,
          },
          data: {
            title,
            description,
            done,
          },
        });

        reply.send(updatedTodo);
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
        const { id } = request.params;
        const { id: userId } = request.user;

        const todo = await fastify.prisma.todo.findFirst({
          where: {
            id,
          },
        });

        if (!todo) {
          reply.status(404).send({ message: 'Not found' });
          return;
        }

        if (todo.userId !== userId) {
          reply.status(403).send({ message: 'Forbidden' });
          return;
        }

        await fastify.prisma.todo.delete({
          where: {
            id,
            userId,
          },
        });

        reply.status(204).send({ message: 'ok' });
      },
    );
};

export default todosRoute;
