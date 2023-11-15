import tap from 'tap';

import { init } from '../src/app';

tap.test('POST /auth/sign-up', async (t) => {
  const fastify = await init();

  t.teardown(() => fastify.close());
});
