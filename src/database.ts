import { connection, connect as mongooseConnect } from 'mongoose';

import type { IConfig } from 'config';
import config from 'config';

const dbConfig: IConfig = config.get('App.database');

export const connect = async () => {
  await mongooseConnect(dbConfig.get('mongoUrl'));
};

export const close = (): Promise<void> => connection.close();
