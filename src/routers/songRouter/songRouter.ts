import express from "express";
import {SongController} from "../../controllers/songController/song.controller";

const songRouter = express.Router();

songRouter.get('/list/songs', SongController.getPublicSongs);
songRouter.get('/search-public',SongController.searchSongPublic)
songRouter.get('/random', SongController.getRandomSong);

export default songRouter;