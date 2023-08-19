import express from 'express';
import {Comments} from "../models/schemas/Comments";
import {Users} from "../models/schemas/Users";
import {Notifies} from "../models/schemas/Notify";
import {Songs} from "../models/schemas/Songs";
import {Playlists} from "../models/schemas/Playlists";

let clients = []

const sseRouter = express.Router();

sseRouter.get('/comment-on-song/:songId', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = req.params.songId;
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient)

    const commentStream = Comments.watch();

    commentStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };
        const commentId = eventData.documentKey._id;
        const comment = await Comments.findById(commentId);
        const songId = comment.song['_id'];

        const relatedComments = await Comments.find({song: songId})
            .populate({path: 'user', model: Users});
        clients.forEach(client => {
            if (client.id === songId.toString()) {
                client.res.write(`data: ${JSON.stringify({eventData, relatedComments, songId})}\n\n`)
            }
        })
    });

    req.on('close', () => {
        commentStream.close()
        clients = clients.filter(client => client.id !== clientId);
    });
});

sseRouter.get('/comment-on-playlist/:playlistId', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    let playlistId = req.params.playlistId
    let relatedComments = await Comments.find({playlist: playlistId})
        .populate({path: 'user', model: Users});
    res.write(`data: ${JSON.stringify({relatedComments, playlistId})}\n\n`);
    const commentStream = Comments.watch();

    commentStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };
        relatedComments = await Comments.find({playlist: playlistId})
            .populate({path: 'user', model: Users});
        res.write(`data: ${JSON.stringify({eventData, relatedComments, playlistId})}\n\n`);
    });

    req.on('close', () => {
        commentStream.close();
    });
});

sseRouter.get('/notifyInNavbar/:userId', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = req.params.userId;
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient)

    const notifyStream = Notifies.watch();

    notifyStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };
        const notifyId = eventData.documentKey._id;
        const notify = await Notifies.findById(notifyId);
        if (notify.entityType === "song") {
            const notifyPopulate = await notify.populate({path: "song", model: Songs});
            const song = notifyPopulate.song;
            const uploader = await Users.findById(song["uploader"]);

            const allNotify = await Notifies.find({}).populate({
                path: 'song',
                model: Songs,
                populate: {
                    path: 'uploader',
                    model: Users
                }
            });

            const allNotifyOfSong = allNotify.filter(notify =>{
                return notify.song !== null;
            })
            const allNotifyOfUploader = allNotifyOfSong.filter(notify => {
                return notify.song["uploader"]._id.toString() === uploader._id.toString();
            });

            res.write(`data: ${JSON.stringify({eventData, allNotifyOfUploader, uploader})}\n\n`);
        } else if (notify.entityType === "playlist") {
            const notifyPopulate = await notify.populate({path: 'playlist', model: Playlists});
            const playlist = notifyPopulate.playlist;
            const uploader = await Users.findById(playlist["uploader"]);

            const allNotify = await Notifies.find({}).populate({
                path: 'playlist',
                model: Playlists,
                populate: {
                    path: 'uploader',
                    model: Users
                }
            });

            const allNotifyOfPlaylist = allNotify.filter(notify =>{
                return notify.playlist !== null;
            })

            const allNotifyOfUploader = allNotifyOfPlaylist.filter(notify => {
                return notify.playlist["uploader"]._id.toString() === uploader._id.toString();
            });

            res.write(`data: ${JSON.stringify({eventData, allNotifyOfUploader, uploader})}\n\n`);
        } else {
            res.write("Cannot find entityType in notify collection");
        }

        if (notify.action === "comment") {

        }
        // const songId = comment.song['_id'];

        // const notify = await Notifies.find({song: songId})
        //     .populate({path: 'user', model: Users});

        // clients.forEach(client => {
        //     if (client.id === songId.toString()) {
        //         client.res.write(`data: ${JSON.stringify({eventData, notify, songId})}\n\n`)
        //     }
        // })
    });

    req.on('close', () => {
        notifyStream.close()
        clients = clients.filter(client => client.id !== clientId);
    });
});


export default sseRouter;