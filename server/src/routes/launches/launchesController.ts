import { Request, Response } from 'express';

import {
  getAllLaunches,
  LaunchAsRequestBody,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} from '../../models/launchesModel';
import { getPagination } from '../../services/query';

export async function httpGetAllLaunches(req: Request, res: Response) {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches(skip, limit);

  return res.status(200).json(launches);
}

export async function httpAddNewLaunch(
  req: Request<{}, {}, LaunchAsRequestBody>,
  res: Response
) {
  const launchRequest = req.body;

  if (
    !launchRequest.mission ||
    !launchRequest.rocket ||
    !launchRequest.launchDate ||
    !launchRequest.target
  ) {
    return res
      .status(400)
      .json({ status: 400, message: 'Missing required launch property' });
  }

  launchRequest.launchDate = new Date(launchRequest.launchDate);
  if (isNaN(launchRequest.launchDate.valueOf())) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid launch date' });
  }

  const newLaunch = await scheduleNewLaunch(launchRequest);

  return res.status(201).json(newLaunch);
}

export async function httpAbortLaunch(
  req: Request<{ launchId: string }>,
  res: Response
) {
  const launchId = Number(req.params.launchId);

  if (isNaN(launchId)) {
    return res.json(400).json({ status: 400, message: 'Invalid Launch ID' });
  }

  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    return res.json(404).json({ status: 404, message: 'Launch not found' });
  }

  const aborted = await abortLaunchById(launchId);
  return res.status(200).json(aborted);
}
