import express from 'express';

import {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} from './launchesController';

const router = express.Router();

router.route('/').get(httpGetAllLaunches).post(httpAddNewLaunch);
router.route('/:launchId').delete(httpAbortLaunch);

export default router;
