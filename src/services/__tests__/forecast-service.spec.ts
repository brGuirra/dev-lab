import { ForecastProcessingInternalError, ForecastService } from '../forecast.service';

import type { Beach } from '@src/models/beach';
import { BeachPosition } from '@src/models/beach';
import { StormGlassClient } from '@src/clients/stormGlass';
import { faker } from '@faker-js/faker';
import stormGlassNormalizedResponseFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassClient = new StormGlassClient() as jest.Mocked<StormGlassClient>;

  it('should return a forecast for a list of beaches', async () => {
    mockedStormGlassClient.fetchPoints.mockResolvedValue(stormGlassNormalizedResponseFixture);

    const beaches: Beach[] = [
      {
        lat: Number(faker.address.latitude()),
        lng: Number(faker.address.longitude()),
        name: faker.address.cityName(),
        position: BeachPosition.E,
      },
    ];

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: beaches[0].lat,
            lng: beaches[0].lng,
            name: beaches[0].name,
            position: beaches[0].position,
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: beaches[0].lat,
            lng: beaches[0].lng,
            name: beaches[0].name,
            position: beaches[0].position,
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: beaches[0].lat,
            lng: beaches[0].lng,
            name: beaches[0].name,
            position: beaches[0].position,
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100,
          },
        ],
      },
    ];

    const forecast = new ForecastService(mockedStormGlassClient);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an empty list when the beachs array is empty', async () => {
    const forecast = new ForecastService();
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it('should throw an internal processing error when an error is thrown by storm glass client', async () => {
    const beaches: Beach[] = [
      {
        lat: Number(faker.address.latitude()),
        lng: Number(faker.address.longitude()),
        name: faker.address.cityName(),
        position: BeachPosition.E,
      },
    ];

    mockedStormGlassClient.fetchPoints.mockRejectedValue('Error fetching data');

    const forecast = new ForecastService(mockedStormGlassClient);

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(ForecastProcessingInternalError);
  });
});
