import t from 'tap'
import { init } from '../src/app'

t.test('GET /ping', async (t) => {
  const fastify = await init()

  // At the end of your tests it is highly recommended to call `.close()`
  // to ensure that all connections to external services get closed.
  t.teardown(() => fastify.close())

  const response = await fastify.inject({
    method: 'GET',
    url: '/ping',
  })

  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8')

  // JSON response {'ping': 'pong'}
  t.same(JSON.parse(response.body), { ping: 'pong' })
})
