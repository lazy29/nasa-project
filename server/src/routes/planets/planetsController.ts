import { Request, Response } from 'express';

import { getAllPlanets } from '../../models/planetsModel';

export async function httpGetAllPlanets(req: Request, res: Response) {
  return res.status(200).json(await getAllPlanets());
}
