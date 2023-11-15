import { Type } from '@sinclair/typebox';

const TodoSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  done: Type.Boolean(),
  createdAt: Type.Any(),
  updatedAt: Type.Any(),
});

const CreateTodoSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
});

const UpdateTodoSchema = Type.Partial(
  Type.Pick(TodoSchema, ['title', 'description', 'done']),
);

export { TodoSchema, CreateTodoSchema, UpdateTodoSchema };
