import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse';

import { Planet } from './planetsMongo';

function isHabitablePlanet(planet: any) {
  return (
    planet.koi_disposition === 'CONFIRMED' &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}

const readableStream = fs.createReadStream(
  path.join(__dirname, '../../data/keplar_data.csv')
);

export function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    readableStream
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (chunk) => {
        if (isHabitablePlanet(chunk)) {
          savePlanet(chunk);
        }
      })
      .on('error', reject)
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;

        console.log(`${countPlanetsFound} habitable planets found`);
        resolve(countPlanetsFound);
      });
  });
}

async function savePlanet(planet: any) {
  try {
    await Planet.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet\n${err}`);
  }
}

export async function getAllPlanets() {
  return await Planet.find({}, { _id: 0, __v: 0 });
}
