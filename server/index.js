import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import * as models from './models/models.js';
import { sequelize } from './db.js';
import { router } from './controllers/router.js';
import { apiErrorMiddleware } from './middlewares/apiErrorMiddleware.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);

app.use(apiErrorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {console.log(`Server has been started on PORT ${PORT}...`)});
  } catch(e) {
    console.log(e);
  }
}

start();
