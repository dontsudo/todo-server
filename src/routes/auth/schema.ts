import { Type } from '@sinclair/typebox';

const LoginSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export { LoginSchema };
