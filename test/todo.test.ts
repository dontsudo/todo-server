import { test } from 'tap'
import { init } from '../src/app'

test('GET /todos', async (t) => {
  const app = await init()

  const response = await app.inject({
    method: 'GET',
    url: '/todos',
  })

  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8')
})
