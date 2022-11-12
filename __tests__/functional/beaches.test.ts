import { BeachPosition } from '@src/services/forecast.service';
import { faker } from '@faker-js/faker';

describe('Beaches functional tests', () => {
  it('Should be able to create a beach', async () => {
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
