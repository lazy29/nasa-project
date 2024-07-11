import express from 'express';

import planetsRouter from './planets/planetsRouter';
import launchesRouter from './launches/launchesRouter';

const apiRouter = express.Router();

apiRouter.use('/planets', planetsRouter);
apiRouter.use('/launches', launchesRouter);

export default apiRouter;
