import { Beach, BeachPosition } from '@src/models/beach';

import { faker } from '@faker-js/faker';

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}));
  it('should be able to create a beach', async () => {
    const beach = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
      name: faker.address.cityName(),
      position: BeachPosition.E,
    };

    const response = await global.testRequest.post('/beaches').send(beach);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(beach));
  });
});
