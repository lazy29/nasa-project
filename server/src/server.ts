import http from 'node:http';
import path from 'node:path';

import dotenv from 'dotenv';
dotenv.config({
  path: path.join(__dirname, '../config.env'),
});

import app from './app';
import { mongoConnect } from './services/mongo';
import { loadPlanetsData } from './models/planetsModel';
import { loadLaunchData } from './models/launchesModel';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();
