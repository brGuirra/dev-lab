import { Beach, BeachPosition } from '@src/models/beach';

import apiForecastResponse1BeachFixture from '@tests/fixtures/api_forecast_response_1_beach.json';
import nock from 'nock';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});

    const beach = new Beach({
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    });

    await beach.save();
  });

  it('should return forecast data object on success', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
        end: /(.*)/,
      })
      .reply(200, stormGlassWeather3HoursFixture);

    const { body, status } = await global.testRequest.get('/forecast');

    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });

  it('should return 500 when something wrong happens while processing the forecast', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast');

    expect(status).toBe(500);
  });
});
