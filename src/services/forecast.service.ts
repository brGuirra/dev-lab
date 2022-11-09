import type { ForecastPoint } from '@src/clients/stormGlass';
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

export class ForecastService {
  constructor(protected stormGlassClient: StormGlassClient = new StormGlassClient()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const { lat, lng, name, position } = beach;
      const points = await this.stormGlassClient.fetchPoints({
        lat,
        lng,
      });
      const enrichedBeachData: BeachForecast[] = points.map((point) => ({
        lat,
        lng,
        name,
        position,
        rating: 1,
        ...point,
      }));

      pointsWithCorrectSources.push(...enrichedBeachData);
    }

    return pointsWithCorrectSources;
  }
}
