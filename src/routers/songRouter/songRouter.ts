import express from "express";
import {SongController} from "../../controllers/songController/song.controller";

const songRouter = express.Router();
songRouter.get('/playlist-public/:playlistId',SongController.getPlaylistPublic)
songRouter.get('/list/songs', SongController.getPublicSongs);
songRouter.get('/search-public',SongController.searchSongPublic)
songRouter.post('/random', SongController.getRandomSong);
songRouter.get('/singers', SongController.getSingers);
songRouter.get('/composers', SongController.getComposers);
songRouter.get('/tags', SongController.getTags);

export default songRouter;