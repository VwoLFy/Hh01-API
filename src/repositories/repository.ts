export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}
type FieldErrorType = {
    "message": string,
    "field": string
}
export type APIErrorResultType = {
    "errorsMessages": FieldErrorType[]
}
export type CreateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions: string[]
}
export type UpdateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions: string[] | null,
    canBeDownloaded: boolean | null,
    minAgeRestriction: number | null,
    publicationDate: string | null
}

enum listRes {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}

let resolutions: string[] = Object.values(listRes)

let videos: VideoType[] = []

export const videosRepository = {
    findVideos() {
        return videos;
    },
    findVideoById(id: number) {
        let foundVideo = videos.find(v => v.id === id);
        return foundVideo
    },
    createVideo(dto: CreateVideoInputModel) {
        const {title, author, availableResolutions} = dto
        let APIErrorResult: APIErrorResultType = {
            "errorsMessages": []
        }

        if (typeof title !== "string" || !title.trim()) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! empty parameter or not a string",
                    field: "title"
                })
        } else if (title.length > 40) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! maxLength: 40",
                    field: "title"
                })
        }
        if (typeof author !== "string" || !author.trim()) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! empty parameter or not a string",
                    field: "author"
                })
        } else if (author.length > 20) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! maxLength: 20",
                    field: "author"
                })
        }

        if (!Array.isArray(availableResolutions)) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! input is not array",
                    field: "availableResolutions"
                })
        } else {
            for (let res of availableResolutions) {
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
            return {isPosted: false, result: APIErrorResult}
        }

        let createdAt = new Date();

        let newVideo = {
            id: videos.length + 1,
            title: title,
            author: author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toJSON(),
            publicationDate: (new Date(createdAt.setDate(createdAt.getDate() + 1))).toJSON(),
            availableResolutions: availableResolutions
        }
        videos.push(newVideo);
        return {isPosted: true, result: newVideo}
    },
    updateVideoById(id: number, title: string, author: string, canBeDownloaded: boolean, minAgeRestriction: number | null, publicationDate: string, availableResolutions: listRes[]) {
        let APIErrorResult: APIErrorResultType = {
            "errorsMessages": []
        }
        if (typeof title !== "string" || !title.trim()) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! empty parameter or not a string",
                    field: "title"
                })
        } else if (title.length > 40) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! maxLength: 40",
                    field: "title"
                })
        }
        if (typeof author !== "string" || !author.trim()) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! empty parameter or not a string",
                    field: "author"
                })
        } else if (author.length > 20) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! maxLength: 20",
                    field: "author"
                })
        }
        if (typeof canBeDownloaded !== "boolean") {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! not boolean parameter",
                    field: "canBeDownloaded"
                })
        }
        if (typeof publicationDate !== "string") {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! is not valid date",
                    field: "publicationDate"
                })
        }
        if (minAgeRestriction != null && (typeof minAgeRestriction != "number" || (minAgeRestriction > 18 || minAgeRestriction < 1))) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! minAgeRestriction must be in range from 1 to 18",
                    field: "minAgeRestriction"
                })
        }
        if (!Array.isArray(availableResolutions)) {
            APIErrorResult.errorsMessages.push(
                {
                    message: "Error! input is not valid",
                    field: "availableResolutions"
                })
        } else {
            for (let res of availableResolutions) {
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
            return {isUpdated: false, error: APIErrorResult}
        }

        let foundVideo = videos.find(v => v.id === id)
        if (foundVideo) {
            foundVideo.title = title;
            foundVideo.author = author;
            if (canBeDownloaded != null) foundVideo.canBeDownloaded = canBeDownloaded;
            if (minAgeRestriction) foundVideo.minAgeRestriction = minAgeRestriction;
            if (publicationDate != null) foundVideo.publicationDate = publicationDate;
            if (availableResolutions != null) {
                foundVideo.availableResolutions = availableResolutions;
            }
            return {isUpdated: true, error: null}
        } else {
            return {isUpdated: false, error: null}
        }
    },
    deleteVideo(id: number) {
        let foundVideo = videos.find(v => v.id == id)
        if (foundVideo) {
            videos.splice(videos.indexOf(foundVideo), 1);
            return true
        } else {
            return false
        }
    },
    deleteAllVideos() {
        videos.splice(0);
    }
}