import express from "express";
import userController from "../../controllers/userController/user.controller";
import {Security} from "../../security/security";
import {NotifyController} from "../../controllers/notifyController/notify.controller";

const userRouter = express.Router();

userRouter.get('/songs/:id', userController.getOneSong);
userRouter.get('/songs/:songId/comments', userController.showCommentInSong);

userRouter.use(Security.verifyToken);

userRouter.post('/songs', userController.addSong);
userRouter.post('/playlists/:playlistId/songs', userController.addSongToPlaylist);
userRouter.delete('/playlists/:playlistId/songs/:songId', userController.removeSongFromPlaylist); // post to delete
userRouter.post('/songs/:songId/comments', userController.commentOnSong);
userRouter.post('/playlists/:playlistId/comments', userController.commentOnPlaylist);
userRouter.delete('/comments/:commentId', userController.deleteComment); // get to delete
userRouter.get('/songs', userController.getSongs);
userRouter.get('/song/like/:id', userController.likeSong);   // get to patch
userRouter.get('/song/dislike/:id', userController.dislikeSong); // get to patch
userRouter.get('/playlist/like/:id', userController.likePlaylist); // get to patch
userRouter.get('/playlist/dislike/:id', userController.dislikePlaylist); // get to patch
userRouter.get('/details', userController.getDetail);
userRouter.get('/playlists', userController.getPlayList);
userRouter.get('/playlists/:playlistId/songs', userController.getSongInPlaylist);
userRouter.get('/search/songs', userController.searchSong);
userRouter.put('/password', userController.editPassword);
userRouter.put('/info', userController.editInfo);
userRouter.delete('/songs', userController.deleteSong);
userRouter.post('/playlists', userController.createPlaylist)
userRouter.delete('/playlists', userController.deletePlaylist)
userRouter.put('/playlists', userController.editPlayList)
userRouter.put('/songs/update-state', userController.updateSongState);
userRouter.put('/songs', userController.editSong);

userRouter.patch('/notifications/:id/seen', NotifyController.changeToSeen)
export default userRouter;
