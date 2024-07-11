import express from 'express';

import { httpGetAllPlanets } from './planetsController';

const router = express.Router();

router.route('/').get(httpGetAllPlanets);

export default router;
