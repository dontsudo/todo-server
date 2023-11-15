import cookie from '@fastify/cookie';
import { User } from '@prisma/client';
import fp from 'fastify-plugin';

import { verifyAccessToken } from '../libs/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

const guardPlugin = fp(async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    const { access_token } = request.cookies;

    fastify.log.info('cookies', request.cookies);

    if (!access_token) {
      reply.code(401).send({ message: 'Unauthorized' });
      return;
    }

    const payload = await verifyAccessToken(access_token);
    const user = await fastify.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      reply.code(401).send({ message: 'Unauthorized' });
      return;
    }

    request.user = user;
  });
});

export { guardPlugin };
