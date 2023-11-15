import { TSchema, Type } from '@sinclair/typebox';

const PaginationQuerySchema = Type.Object({
  offset: Type.Integer({ default: 0 }),
  limit: Type.Integer({ default: 10 }),
});

const PaginationResponseSchema = <T extends TSchema>(schema: T) =>
  Type.Object({
    data: Type.Array(schema),
    total: Type.Integer(),
    offset: Type.Integer(),
    limit: Type.Integer(),
  });

export { PaginationQuerySchema, PaginationResponseSchema };
