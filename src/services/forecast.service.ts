import type { ForecastPoint } from '@src/clients/stormGlass';
import { InternalError } from '@src/utils/errors/internal-error';
import { StormGlassClient } from '@src/clients/stormGlass';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export type Beach = {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
};

export type BeachForecast = ForecastPoint &
  Omit<Beach, 'user'> & {
    rating: number;
  };

export type ForecastByTime = {
  time: string;
  forecast: BeachForecast[];
};

export class ForecastProcessingInternalError extends InternalError {
  constructor(message?: string) {
    const internalMessage = 'Unexpected error during the forecast processing';

    super(message ? `${internalMessage}: ${message}` : internalMessage);
  }
}

export class ForecastService {
  constructor(protected stormGlassClient: StormGlassClient = new StormGlassClient()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<ForecastByTime[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const { lat, lng } = beach;
        const points = await this.stormGlassClient.fetchPoints({
          lat,
          lng,
        });
        const enrichedBeachData: BeachForecast[] = this.enricheBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ForecastProcessingInternalError(error.message);
      }

      throw new ForecastProcessingInternalError();
    }
  }

  private mapForecastByTime(forecast: BeachForecast[]): ForecastByTime[] {
    const forecastByTime: ForecastByTime[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((p) => p.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
        continue;
      }

      forecastByTime.push({
        time: point.time,
        forecast: [point],
      });
    }

    return forecastByTime;
  }

  private enricheBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    const { lat, lng, name, position } = beach;

    return points.map((point) => ({
      lat,
      lng,
      name,
      position,
      rating: 1,
      ...point,
    }));
  }
}
