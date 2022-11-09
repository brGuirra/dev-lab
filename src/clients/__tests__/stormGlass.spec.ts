import * as HTTPUtils from '@src/utils/http';

import { StormGlassClient } from '@src/clients/stormGlass';
import { faker } from '@faker-js/faker';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

jest.mock('@src/utils/http');

describe('StormGlass Client', () => {
  const MockedRequestClass = HTTPUtils.Request as jest.Mocked<typeof HTTPUtils.Request>;
  const mockedRequest = new HTTPUtils.Request() as jest.Mocked<HTTPUtils.Request>;

  it('should return the normalized forecast from StormGlass service', async () => {
    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };
    const stormGlassClient = new StormGlassClient(mockedRequest);

    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HTTPUtils.Response);

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
    const stormGlassClient = new StormGlassClient(mockedRequest);

    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtils.Response);

    const response = await stormGlassClient.fetchPoints(coodirnates);
    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlassClient when the request fail before reaching the service', async () => {
    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };

    const stormGlassClient = new StormGlassClient(mockedRequest);

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    await expect(stormGlassClient.fetchPoints(coodirnates)).rejects.toThrow(
      'Unexpected when trying to communicate to Storm Glass Client: Network Error'
    );
  });

  it('should get an StormGlassResponseError object when the StormGlass service responds with error', async () => {
    const rateLimitError = {
      status: 429,
      data: { errors: ['Rate Limit reached'] },
    };
    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    mockedRequest.get.mockRejectedValue(new FakeAxiosError(rateLimitError));

    MockedRequestClass.isRequestError.mockReturnValue(true);

    MockedRequestClass.extractErrorData.mockReturnValue(rateLimitError);

    const coodirnates = {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
    };

    const stormGlassClient = new StormGlassClient(mockedRequest);

    await expect(stormGlassClient.fetchPoints(coodirnates)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
