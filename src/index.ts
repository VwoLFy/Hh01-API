import express from "express"
import bodyParser from "body-parser";
import {deleteRouter, videosRouter} from "./routes/videos-router";

const app = express();
const PORT = process.env.PORT || 5000;

let parserM = bodyParser({});
app.use(parserM);

app.use("/testing/all-data", deleteRouter)
app.use("/videos", videosRouter)

app.listen(PORT, () => {
    console.log(`Now is listening port: ${PORT}`)
})