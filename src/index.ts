import { init } from './app'
import { env } from './env'

init()
  .then((app) => {
    app.listen({ port: env.PORT }, (err, address) => {
      if (err) {
        app.log.error(err)
        process.exit(1)
      }
      app.log.info(`Server listening at ${address}`)
    })
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
