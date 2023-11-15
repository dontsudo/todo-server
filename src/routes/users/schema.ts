import { Type } from '@sinclair/typebox';

const UserSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  createdAt: Type.Any(),
  updatedAt: Type.Any(),
});

const UserWithoutPasswordSchema = Type.Omit(UserSchema, ['password']);

const CreateUserSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  password: Type.String(),
});

const UpdateUserSchema = Type.Partial(
  Type.Pick(UserSchema, ['name', 'email', 'password']),
);

export {
  UserSchema,
  UserWithoutPasswordSchema,
  CreateUserSchema,
  UpdateUserSchema,
};
