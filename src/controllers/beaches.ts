import { Controller, Post } from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Beach } from '@src/models/beach';

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(request: Request<never, never, Beach, never>, response: Response): Promise<void> {
    const { lat, lng, name, position } = request.body;

    const beach = new Beach({ lat, lng, name, position });
    const result = await beach.save();

    response.status(201).send(result);
  }
}
