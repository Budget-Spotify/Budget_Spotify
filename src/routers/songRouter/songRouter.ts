import express from "express";
import {SongController} from "../../controllers/songController/song.controller";

const songRouter = express.Router();

songRouter.get('/list/songs', SongController.getPublicSongs);

export default songRouter;