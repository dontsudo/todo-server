import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import argon from 'argon2';
import { FastifyInstance } from 'fastify';

import { signAccessToken } from '../../libs/jwt';
import { ErrorSchema } from '../errors';
import { CreateUserSchema, UserWithoutPasswordSchema } from '../users/schema';
import { LoginSchema } from './schema';

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
        const { name, email, password } = request.body;

        const userExists = await fastify.prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (userExists) {
          reply.status(400).send({ message: 'User already exists' });
          return;
        }

        const hashedPassword = await argon.hash(password);
        const user = await fastify.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        const access_token = await signAccessToken({
          id: user.id,
          email: user.email,
        });

        reply.setCookie('access_token', access_token, {
          httpOnly: true,
          path: '/',
        });
        reply.status(201).send(user);
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
        const { email, password } = request.body;

        const user = await fastify.prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          reply.status(400).send({ message: 'User not found' });
          return;
        }

        const passwordMatches = await argon.verify(user.password, password);
        if (!passwordMatches) {
          reply.status(400).send({ message: 'Password does not match' });
          return;
        }

        const access_token = await signAccessToken({
          id: user.id,
          email: user.email,
        });

        reply.setCookie('access_token', access_token, {
          httpOnly: true,
          path: '/',
        });
        reply.send(user);
      },
    );
};

export default authRoute;
