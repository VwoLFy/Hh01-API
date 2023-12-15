import express from 'express';
import { deleteRouter, mainRouter, videosRouter } from './routes/router';
import { mainRoute, testing_all_dataRoute, videosRoute } from './routes/routes';

export const app = express();
const PORT = process.env.PORT || 5000;

const parserM = express.json();
app.use(parserM);

app.use(testing_all_dataRoute, deleteRouter);
app.use(videosRoute, videosRouter);
app.use(mainRoute, mainRouter);

app.listen(PORT, () => {
  console.log(`Now is listening port: ${PORT}`);
});
