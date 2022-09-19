import {Request, Response, Router} from "express";

export const videosRouter = Router({});
export const deleteRouter = Router({});

type typeResolutions = Array<string>
type typeVideo = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": number | null,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": typeResolutions
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
    "errorsMessages": []
}

videosRouter.get("", (req: Request, res: Response) => {
    res.send(videos)
})
videosRouter.post("", (req: Request, res: Response) => {
    APIErrorResult.errorsMessages.splice(0);
    if (req.body.title == null) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! empty parameter",
                field: "title"
            })
    }
    if (req.body.author == null) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! empty parameter",
                field: "author"
            })
    }
    if (req.body.title != null && req.body.title.length > 40) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! maxLength: 40",
                field: "title"
            })
    }
    if (req.body.author != null && req.body.author.length > 20) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! maxLength: 20",
                field: "author"
            })
    }
    if (!Array.isArray(req.body.availableResolutions)) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! input is not valid",
                field: "availableResolutions"
            })
    } else {
        for (let res of req.body.availableResolutions) {
            if (!resolutions.includes(res)) {
                APIErrorResult.errorsMessages.push(
                    {
                        message: "Error! input is not valid",
                        field: "availableResolutions"
                    })
                break
            }
        }
    }
    if (APIErrorResult.errorsMessages.length > 0) {
        res.status(400).send(APIErrorResult)
        return
    }

    let createdAt = new Date();

    let newVideo = {
        "id": videos.length + 1,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": createdAt.toJSON(),
        "publicationDate": (new Date(createdAt.setDate(createdAt.getDate() + 1))).toJSON(),
        "availableResolutions": req.body.availableResolutions
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
    APIErrorResult.errorsMessages.splice(0);
    if (req.body.title == null) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! empty parameter",
                field: "title"
            })
    }
    if (req.body.author == null) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! empty parameter",
                field: "author"
            })
    }
    if (req.body.title != null && req.body.title.length > 40) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! maxLength: 40",
                field: "title"
            })
    }
    if (req.body.author != null && req.body.author.length > 20) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! maxLength: 20",
                field: "author"
            })
    }
    if (typeof req.body.canBeDownloaded !== "boolean") {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! not boolean parameter",
                field: "canBeDownloaded"
            })
    }
    if (req.body.minAgeRestriction != null && (typeof req.body.minAgeRestriction != "number" || (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1))) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! minAgeRestriction must be in range from 1 to 18",
                field: "minAgeRestriction"
            })
    }
    if (!Array.isArray(req.body.availableResolutions)) {
        APIErrorResult.errorsMessages.push(
            {
                message: "Error! input is not valid",
                field: "availableResolutions"
            })
    } else {
        for (let res of req.body.availableResolutions) {
            if (!resolutions.includes(res)) {
                APIErrorResult.errorsMessages.push(
                    {
                        message: "Error! input is not valid",
                        field: "availableResolutions"
                    })
                break
            }
        }
    }
    if (APIErrorResult.errorsMessages.length > 0) {
        res.status(400).send(APIErrorResult)
        return
    }

    let video = videos.find(v => v.id == +req.params.id)
    if (video) {
        video.title = req.body.title;
        video.author = req.body.author;
        if (req.body.canBeDownloaded != null) video.canBeDownloaded = req.body.canBeDownloaded;
        if (req.body.minAgeRestriction) video.minAgeRestriction = req.body.minAgeRestriction;
        if (req.body.publicationDate != null) video.publicationDate = req.body.publicationDate;
        if (req.body.availableResolutions != null) {
            video.availableResolutions = req.body.availableResolutions;
        }
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