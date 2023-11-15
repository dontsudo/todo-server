import fastifyCookie from '@fastify/cookie';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';
import { prismaPlugin } from './plugins/prisma';
import routes from './routes';

const init = async () => {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  fastify.get('/', async function (request, reply) {
    reply.send({
      message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
  });

  fastify.register(fastifyCookie, {}).register(prismaPlugin);
  fastify.register(routes);

  return fastify;
};

export { init };
