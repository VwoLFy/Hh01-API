import { Request, Response, Router } from 'express';
import { videosRepository } from '../repositories/repository';
import { HTTP_Status } from '../enums';

export const videosRouter = Router({});
export const deleteRouter = Router({});
export const mainRouter = Router({});

mainRouter.get('/', (req: Request, res: Response) => {
  const mainMessage = 'Hola!';
  res.send(mainMessage);
});

videosRouter.get('/', (req: Request, res: Response) => {
  const foundVideos = videosRepository.findVideos();
  res.send(foundVideos);
});
videosRouter.post('/', (req: Request, res: Response) => {
  const resultOfCreated = videosRepository.createVideo(req.body);
  if (!resultOfCreated.isPosted) {
    res.status(HTTP_Status.BAD_REQUEST_400);
  } else {
    res.status(HTTP_Status.CREATED_201);
  }
  res.send(resultOfCreated.result);
});
videosRouter.get('/:id', (req: Request, res: Response) => {
  let foundVideo = videosRepository.findVideoById(+req.params.id);
  if (foundVideo) {
    res.send(foundVideo);
  } else {
    res.sendStatus(HTTP_Status.NOT_FOUND_404);
  }
});
videosRouter.put('/:id', (req: Request, res: Response) => {
  let resultOfUpdated = videosRepository.updateVideoById(+req.params.id, req.body);
  if (!resultOfUpdated.isUpdated && resultOfUpdated.error) {
    res.status(HTTP_Status.BAD_REQUEST_400).send(resultOfUpdated.error);
  } else if (!resultOfUpdated.isUpdated && resultOfUpdated) {
    res.sendStatus(HTTP_Status.NOT_FOUND_404);
  } else {
    res.sendStatus(HTTP_Status.NO_CONTENT_204);
  }
});
videosRouter.delete('/:id', (req: Request, res: Response) => {
  let isDeleted = videosRepository.deleteVideo(+req.params.id);
  if (isDeleted) {
    res.sendStatus(HTTP_Status.NO_CONTENT_204);
  } else {
    res.sendStatus(HTTP_Status.NOT_FOUND_404);
  }
});

deleteRouter.delete('/', (req: Request, res: Response) => {
  videosRepository.deleteAllVideos();
  res.sendStatus(HTTP_Status.NO_CONTENT_204);
});
