import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { guardPlugin } from '../../plugins/guard';
import { ErrorSchema } from '../errors';
import { UserWithoutPasswordSchema } from './schema';

const usersRoute = async (fastify: FastifyInstance) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .register(guardPlugin)
    .get(
      '/me',
      {
        schema: {
          response: {
            '200': UserWithoutPasswordSchema,
            '404': ErrorSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.user;

        const user = await fastify.prisma.user.findUnique({
          where: {
            id,
          },
        });

        if (!user) {
          reply.status(404).send({ message: 'User not found' });
          return;
        }

        reply.send(user);
      },
    )
    .delete('/me', {}, async (request, reply) => {
      const { id } = request.user;

      await fastify.prisma.user.delete({
        where: {
          id,
        },
      });

      reply.status(204).send();
    });
};

export default usersRoute;
