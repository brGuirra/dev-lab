import * as HTTPUtils from '@src/utils/http';

import type { IConfig } from 'config';
import { InternalError } from '@src/utils/errors/internal-error';
import config from 'config';

export type StormGlassPointSource = {
  [key: string]: number;
};

export type StormGlassPoint = {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
};

export type StormGlassForecastResponse = {
  hours: StormGlassPoint[];
};

export type ForecastPoint = {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
};

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected when trying to communicate to Storm Glass Client';

    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service';

    super(`${internalMessage}: ${message}`);
  }
}

const stormGlasResourceConfig: IConfig = config.get('App.resources.StormGlass');

export class StormGlassClient {
  private readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  private readonly stormGlassAPISource = 'noaa';

  constructor(protected request = new HTTPUtils.Request()) {}

  public async fetchPoints({ lat, lng }: { lat: number; lng: number }): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `${stormGlasResourceConfig.get('apiUrl')}/v2/weather/point?lat=${lat}&lng=${lng}&params=${
          this.stormGlassAPIParams
        }&source=${this.stormGlassAPISource}`,
        {
          headers: { Authorization: stormGlasResourceConfig.get('apiToken') },
        }
      );

      return this.normalizeResponse(response.data);
    } catch (error: unknown) {
      if (error instanceof Error && HTTPUtils.Request.isRequestError(error)) {
        const requestError = HTTPUtils.Request.extractErrorData(error);
        throw new StormGlassResponseError(`Error: ${JSON.stringify(requestError.data)} Code: ${requestError.status}`);
      }

      throw new ClientRequestError((error as { message: any }).message);
    }
  }

  private normalizeResponse(points: StormGlassForecastResponse): ForecastPoint[] {
    return points.hours
      .filter((point) => this.isValidPoint(point))
      .map((point) => ({
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        time: point.time,
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource],
      }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
