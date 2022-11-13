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

  it('should throw an error when the data to create a beach is not valid', async () => {
    const beach = {
      lat: 'invalid_string',
      lng: Number(faker.address.longitude()),
      name: faker.address.cityName(),
      position: BeachPosition.E,
    };

    const response = await global.testRequest.post('/beaches').send(beach);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error:
        'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
    });
  });
});
