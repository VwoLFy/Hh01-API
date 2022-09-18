import {Request, Response, Router} from "express";

export const videosRouter = Router({});
export const deleteRouter = Router({});

type typeResolutions = Array<string | null>
type typeVideo = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": number | null,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": typeResolutions | null
}
type typeError = {
    "message": string,
    "field": string
}
type typeErrorResult = {
    "errorsMessages": Array<typeError>
}

let resolutions: typeResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
let videos: Array<typeVideo> = []
let APIErrorResult: typeErrorResult = {
    "errorsMessages": [
        {
            "message": "",
            "field": ""
        }
    ]
}


videosRouter.get("", (req: Request, res: Response) => {
    res.send(videos)
})
videosRouter.post("", (req: Request, res: Response) => {
    if (req.body.title == null) {
        APIErrorResult.errorsMessages[0].message = "Error! empty parameter";
        APIErrorResult.errorsMessages[0].field = "title";
        res.status(400).send(APIErrorResult)
        return
    }
    if (req.body.author == null) {
        APIErrorResult.errorsMessages[0].message = "Error! empty parameter";
        APIErrorResult.errorsMessages[0].field = "author";
        res.status(400).send(APIErrorResult)
        return
    }
    if (req.body.title.length > 40) {
        APIErrorResult.errorsMessages[0].message = "Error! maxLength: 40";
        APIErrorResult.errorsMessages[0].field = "title";
        res.status(400).send(APIErrorResult)
        return
    }
    if (req.body.author.length > 20) {
        APIErrorResult.errorsMessages[0].message = "Error! maxLength: 20";
        APIErrorResult.errorsMessages[0].field = "author";
        res.status(400).send(APIErrorResult)
        return
    }
    let createdAt = new Date();
    let resolutionOfVideo = [];
    if (req.body.availableResolutions && resolutions.find(r => r == req.body.availableResolutions[0])) {
        resolutionOfVideo.push(req.body.availableResolutions[0]);
    }
    let newVideo = {
        "id": videos.length + 1,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": createdAt.toJSON(),
        "publicationDate": (new Date(createdAt.setDate(createdAt.getDate() + 1))).toJSON(),
        "availableResolutions": resolutionOfVideo
    }
    videos.push(newVideo);
    res.status(201).send(newVideo)
})
videosRouter.get("/:id", (req: Request, res: Response) => {
    let video = videos.find(v => v.id == +req.params.id)
    if (video) {
        res.send(video);
    } else {
        res.sendStatus(404);
    }
})
videosRouter.put("/:id", (req: Request, res: Response) => {
    if (req.body.title == null) {
        APIErrorResult.errorsMessages[0].message = "Error! empty parameter";
        APIErrorResult.errorsMessages[0].field = "title";
        res.status(400).send(APIErrorResult)
        return
    }
    if (req.body.author == null) {
        APIErrorResult.errorsMessages[0].message = "Error! empty parameter";
        APIErrorResult.errorsMessages[0].field = "author";
        res.status(400).send(APIErrorResult)
        return
    }
    if (req.body.title.length > 40) {
        APIErrorResult.errorsMessages[0].message = "Error! maxLength: 40";
        APIErrorResult.errorsMessages[0].field = "title";
        res.status(400).send(APIErrorResult)
        return
    }
    if (req.body.author.length > 20) {
        APIErrorResult.errorsMessages[0].message = "Error! maxLength: 20";
        APIErrorResult.errorsMessages[0].field = "author";
        res.status(400).send(APIErrorResult)
        return
    }
    let video = videos.find(v => v.id == +req.params.id)
    if (video) {
        video.title = req.body.title;
        video.author = req.body.author;
        if (req.body.canBeDownloaded != null) video.canBeDownloaded = req.body.canBeDownloaded;
        if (req.body.minAgeRestriction != null) video.minAgeRestriction = req.body.minAgeRestriction;
        if (req.body.publicationDate != null) video.publicationDate = req.body.publicationDate;
        if (req.body.availableResolutions != null && resolutions.find(r => r == req.body.availableResolutions[0])) {
            video.availableResolutions = req.body.availableResolutions[0];}
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
})
videosRouter.delete("/:id", (req: Request, res: Response) => {
    let video = videos.find(v => v.id == +req.params.id)
    if (video) {
        videos.splice(videos.indexOf(video), 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
})

deleteRouter.delete("", (req: Request, res: Response) => {
    videos.splice(0);
    res.sendStatus(204);
})