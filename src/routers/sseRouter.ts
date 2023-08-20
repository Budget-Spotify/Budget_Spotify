import express from 'express';
import {Comments} from "../models/schemas/Comments";
import {Users} from "../models/schemas/Users";
import {Notifies} from "../models/schemas/Notify";
import {Songs} from "../models/schemas/Songs";
import {Playlists} from "../models/schemas/Playlists";

let clients = [];
let allClient = [];

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
    allClient.push(newClient)
    let userNeedNotify = [];

    const notifyStream = Notifies.watch();

    notifyStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };

        const notifyId = eventData.documentKey._id;
        const notify = await Notifies.findById(notifyId);
        const entityType: string = notify.entityType;
        const entityObjectId: object = (entityType === "song" ? notify.song : notify.playlist);

        const entity = entityType === "song"
            ? await Songs.findById(entityObjectId)
            : await Playlists.findById(entityObjectId);

        const uploader = await Users.findById(entity["uploader"]);
        const allNotify = await Notifies.find({})
        const uploaderId = uploader._id.toString()
        userNeedNotify.push(uploaderId);

        const allNotifyOfUploader = allNotify.filter(async item => {
            if (item.entityType === "song"){
                const itemPopulate = await item.populate({path: "song", model: Songs});
                const user = itemPopulate.song["uploader"];
                return user["_id"].toString() === uploader["_id"].toString();
            } else {
                const itemPopulate = await item.populate({path: "playlist", model: Playlists});
                const user = itemPopulate.playlist["uploader"];
                return user["_id"].toString() === uploader["_id"].toString();
            }
        })

        if (notify.action === "comment") {
            const allCommentInEntity = await Comments.find({[entityType]: entity['_id']});
            const commentingUsersExceptUploader = allCommentInEntity
                // .filter(commentInEntity => commentInEntity.user.toString() !== uploader._id.toString())  tranh uploader nhan thong bao 2 lan
                .map(commentInEntity => commentInEntity.user.toString());

            userNeedNotify = Array.from(new Set(commentingUsersExceptUploader))
        }

        // const uploaderId = uploader._id; tranh uploader nhan thong bao 2 lan
        // userNeedNotify.push(uploaderId);

        const data = `data: ${JSON.stringify({eventData, allNotifyOfUploader})}\n\n`;

        allClient.forEach(client => {
            if (userNeedNotify.includes(client.id)) {
                console.log(111111111)
                client.res.write(`${data}`);
            }
        })
    });

    req.on('close', () => {
        notifyStream.close()
        allClient = allClient.filter(client => client.id !== clientId);
    });
});


export default sseRouter;