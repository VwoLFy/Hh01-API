import express from "express"
import {deleteRouter, videosRouter} from "./routes/router";

const app = express();
const PORT = process.env.PORT || 5000;

const parserM = express.json()
app.use(parserM);

app.use("/testing/all-data", deleteRouter)
app.use("/videos", videosRouter)

app.listen(PORT, () => {
    console.log(`Now is listening port: ${PORT}`)
})