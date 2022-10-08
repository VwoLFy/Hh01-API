import express from "express"
import {deleteRouter, videosRouter} from "./routes/videos-router";

const app = express();
const parserM = express.json()
const PORT = process.env.PORT || 5000;

app.use(parserM);

app.use("/testing/all-data", deleteRouter)
app.use("/videos", videosRouter)

app.listen(PORT, () => {
    console.log(`Now is listening port: ${PORT}`)
})