import axios from 'axios';
import { FilterQuery } from 'mongoose';

import { ILaunch, Launch } from './launchesMongo';
import { Planet } from './planetsMongo';

export type LaunchAsRequestBody = Pick<
  ILaunch,
  'mission' | 'rocket' | 'launchDate' | 'target'
>;

const DEFAULT_FLIGHT_NUMBER = 1000;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed!');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const launch: ILaunch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: (launchDoc.payloads as any[]).flatMap(
        (payload) => payload.customers
      ),
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

export async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: 'FalconSat',
    rocket: 'Falcon 1',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded!');
    return;
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter: FilterQuery<ILaunch>) {
  return await Launch.findOne(filter);
}

export async function existsLaunchWithId(id: number) {
  return await findLaunch({ flightNumber: id });
}

async function getLatestFlightNumber() {
  const latestLaunch = await Launch.findOne().sort('-flightNumber');

  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

export async function getAllLaunches(skip: number, limit: number) {
  return await Launch.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch: ILaunch) {
  const queryResult = await Launch.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );

  if (queryResult.upsertedId) {
    return await Launch.findById(queryResult.upsertedId, { _id: 0, __v: 0 });
  } else {
    return await Launch.findOne(
      { flightNumber: launch.flightNumber },
      { _id: 0, __v: 0 }
    );
  }
}

export async function scheduleNewLaunch(launchReqBody: LaunchAsRequestBody) {
  // Referential Integrity Check
  const planet = await Planet.findOne({ keplerName: launchReqBody.target });
  if (!planet) throw new Error('No matching planet found');

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch: ILaunch = {
    ...launchReqBody,
    success: true,
    upcoming: true,
    customers: ['NASA', 'SpaceX'],
    flightNumber: newFlightNumber,
  };

  return await saveLaunch(newLaunch);
}

export async function abortLaunchById(id: number) {
  await Launch.updateOne(
    { flightNumber: id },
    {
      success: false,
      upcoming: false,
    }
  );

  return await Launch.findOne({ flightNumber: id }, { _id: 0, __v: 0 });
}
