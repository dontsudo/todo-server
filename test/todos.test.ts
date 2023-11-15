import t from 'tap'
import { init } from '../src/app'

t.test('GET /todos', async (t) => {
  const fastify = await init()

  t.teardown(() => fastify.close())

  const response = await fastify.inject({
    method: 'GET',
    url: '/todos',
  })

  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8')
  t.matchOnly(JSON.parse(response.body), {
    data: Array,
    total: Number,
    offset: Number,
    limit: Number,
  })
})

t.test('POST /todos', async (t) => {
  const fastify = await init()

  t.teardown(() => fastify.close())

  const response = await fastify.inject({
    method: 'POST',
    url: '/todos',
    payload: {
      title: 'test title',
      description: 'test description',
      done: false,
    },
  })

  const createdTodo = JSON.parse(response.payload)

  t.equal(response.statusCode, 201)
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8')
  t.equal(createdTodo.title, 'test title')
  t.equal(createdTodo.description, 'test description')
  t.equal(createdTodo.done, false)

  // Teardown: Delete the created todo
  await fastify.inject({
    method: 'DELETE',
    url: `/todos/${createdTodo.id}`,
  })
})

t.test('PUT /todos/:id', async (t) => {
  const fastify = await init()

  t.teardown(() => fastify.close())

  // First, create a todo
  const createResponse = await fastify.inject({
    method: 'POST',
    url: '/todos',
    payload: {
      title: 'Test Todo',
      description: 'Test Todo Description',
      completed: false,
    },
  })

  const createdTodo = JSON.parse(createResponse.payload)

  // Teardown: Delete the created todo
  await fastify.inject({
    method: 'DELETE',
    url: `/todos/${createdTodo.id}`,
  })
})
