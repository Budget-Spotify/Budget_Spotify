import express from "express";
import userController from "../../controllers/userController/user.controller";
import {Security} from "../../security/security";


const userRouter = express.Router();
userRouter.use(Security.verifyToken);
userRouter.post('/upload/song', userController.addSong);
userRouter.post('/playlist/add-song/:playlistId', userController.addSongToPlaylist);
userRouter.post('/playlist/remove-song/:playlistId', userController.removeSongFromPlaylist);
userRouter.post('/song/add-comment/:songId', userController.commentOnSong);
userRouter.get('/song/show-comment/:songId', userController.showCommentInSong);
userRouter.get('/song/delete-comment/:commentId', userController.deleteCommentOnSong);
userRouter.get('/list/songs', userController.getSongs);
userRouter.get('/song/detail/:id', userController.getOneSong);
userRouter.get('/song/like/:id', userController.likeSong);
userRouter.get('/song/dislike/:id', userController.dislikeSong);
userRouter.get('/playlist/like/:id', userController.likePlaylist);
userRouter.get('playlist/dislike/:id', )
userRouter.get('/info', userController.getDetail);
userRouter.get('/playlist', userController.getPlayList);
userRouter.get('/playlist/:playlistId', userController.getSongInPlaylist);
userRouter.get('/search', userController.searchSong);
userRouter.put('/editpassword', userController.editPassword);
userRouter.put('/editinfo', userController.editInfo);
userRouter.delete('/song/delete', userController.deleteSong);
userRouter.post('/playlist/create', userController.createPlaylist)
userRouter.delete('/playlist/delete', userController.deletePlaylist)
userRouter.put('/playlist/update', userController.editPlayList)
userRouter.put('/song/update-state', userController.updateSongState);
userRouter.put('/song/update', userController.editSong);
export default userRouter;
