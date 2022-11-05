import { StormGlassClient } from 'clients/stormGlass';
import axios from 'axios';
import { faker } from '@faker-js/faker';

jest.mock('axios');

describe('StormGlass Client', () => {
  it('should return the normalized forecast from StormGlass service', async () => {
    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };
    const stormGlassClient = new StormGlassClient(axios);

    axios.get = jest.fn().mockReturnValue({});
    console.log('teste');

    const response = await stormGlassClient.fetchPoints(coodirnates);

    expect(response).toEqual({});
  });
});
