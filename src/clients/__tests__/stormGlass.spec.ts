import { StormGlassClient } from '@src/clients/stormGlass';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

jest.mock('axios');

describe('StormGlass Client', () => {
  it('should return the normalized forecast from StormGlass service', async () => {
    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };
    const stormGlassClient = new StormGlassClient(axios);

    axios.get = jest.fn().mockReturnValue({ data: stormGlassWeather3HoursFixture });

    const response = await stormGlassClient.fetchPoints(coodirnates);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
});
