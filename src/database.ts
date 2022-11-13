import type { IConfig } from 'config';
import config from 'config';
import mongoose from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

export const connect = async () => {
  await mongoose.connect(dbConfig.get('mongoUrl'), {
    auth: {
      username: 'admin',
      password: 'admin',
    },
    dbName: 'surf-forecast',
  });
};

export const close = (): Promise<void> => mongoose.connection.close();
