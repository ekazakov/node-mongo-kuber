import * as dotenv from 'dotenv';
//set up the env variables from './env' or './dev.env'
//to add more presets change package.json

dotenv.config({
  debug: true,
  path: process.env.NODE_ENV === 'production' ? './.env' : './dev.env',
});
