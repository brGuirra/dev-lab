import { Controller, Get } from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Beach } from '@src/models/beach';
import { ForecastService } from '@src/services/forecast.service';

@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(_: Request, response: Response): Promise<void> {
    try {
      const forecastService = new ForecastService();
      const beaches = await Beach.find({});
      const forecastData = await forecastService.processForecastForBeaches(beaches);

      response.status(200).send(forecastData);
    } catch (error) {
      response.status(500).send({ error: 'Something went wrong' });
    }
  }
}
