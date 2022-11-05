import type { AxiosStatic } from 'axios';

export class StormGlassClient {
  private readonly stormGlassAPIParams =
    'swellDirection, swellHeight, swellPeriod, waveDirection,waveHeight, windDirection';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints({ lat, lng }: { lat: number; lng: number }): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=noaa&end=`
    );
  }
}
