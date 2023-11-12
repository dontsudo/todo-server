import app from '../src/app'

describe('request the "/" route', () => {
  it('it should response the GET method', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    })

    expect(response.statusCode).toBe(200)
  })
})
