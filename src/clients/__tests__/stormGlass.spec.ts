import { StormGlassClient } from '@src/clients/stormGlass';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

jest.mock('axios');

describe('StormGlass Client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from StormGlass service', async () => {
    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };
    const stormGlassClient = new StormGlassClient(mockedAxios);

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const response = await stormGlassClient.fetchPoints(coodirnates);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    const stormGlassClient = new StormGlassClient(mockedAxios);

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const response = await stormGlassClient.fetchPoints(coodirnates);
    expect(response).toEqual([]);
  });
});
