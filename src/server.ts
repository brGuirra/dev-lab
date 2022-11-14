import * as database from '@src/database';

import type { Application } from 'express';
import { BeachesController } from './controllers/beaches';
import { ForecastController } from '@src/controllers/forecast';
import { Server } from '@overnightjs/core';
import express from 'express';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();

    this.addControllers([forecastController, beachesController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info(`Server running on port: ${this.port} 🚀`);
    });
  }
}
