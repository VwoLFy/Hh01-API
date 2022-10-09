import {Request, Response, Router} from "express";
import {videosRepository} from "../repositories/repository";

export const videosRouter = Router({});
export const deleteRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
    const foundVideos = videosRepository.findVideos();
    res.send(foundVideos)
})
videosRouter.post("/", (req: Request, res: Response) => {
    const resultOfCreated = videosRepository.createVideo(req.body.title, req.body.author, req.body.availableResolutions)
    if (!resultOfCreated.isPosted) {
        res.status(400)
    } else {
        res.status(201)
    }
    res.send(resultOfCreated.result);

})
videosRouter.get("/:id", (req: Request, res: Response) => {
    let foundVideo = videosRepository.findVideoById(+req.params.id)
    if (foundVideo) {
        res.send(foundVideo);
    } else {
        res.sendStatus(404);
    }
})
videosRouter.put("/:id", (req: Request, res: Response) => {
    let resultOfUpdated = videosRepository.updateVideoById(+req.params.id, req.body.title, req.body.author, req.body.canBeDownloaded, req.body.minAgeRestriction, req.body.publicationDate, req.body.availableResolutions)
    if (!resultOfUpdated.isUpdated && resultOfUpdated.error) {
        res.status(400).send(resultOfUpdated.error)
    } else if (!resultOfUpdated.isUpdated && resultOfUpdated) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
})
videosRouter.delete("/:id", (req: Request, res: Response) => {
    let isDeleted = videosRepository.deleteVideo(+req.params.id)
    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
})

deleteRouter.delete("/", (req: Request, res: Response) => {
    videosRepository.deleteAllVideos();
    res.sendStatus(204);
})