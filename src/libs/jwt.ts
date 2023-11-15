import jwt, { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

import { env } from '../env';

interface JwtPayload extends BaseJwtPayload {
  id: string;
  email: string;
}

export const signAccessToken = async (payload: JwtPayload): Promise<string> => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyAccessToken = async (token: string): Promise<JwtPayload> => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
