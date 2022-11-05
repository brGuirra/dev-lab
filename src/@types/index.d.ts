import type { SuperTest, Test } from 'supertest';
declare global {
  /* eslint-disable-next-line no-var, no-unused-vars */
  var testRequest: SuperTest<Test>;
}
