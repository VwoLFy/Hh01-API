import express from "express"
import {deleteRouter, mainRouter, videosRouter} from "./routes/router";

const app = express();
const PORT = process.env.PORT || 5000;

const parserM = express.json()
app.use(parserM);

app.use("/testing/all-data", deleteRouter)
app.use("/videos", videosRouter)
app.use("/", mainRouter)

app.listen(PORT, () => {
    console.log(`Now is listening port: ${PORT}`)
})