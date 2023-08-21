import express from 'express';
import {Comments} from "../models/schemas/Comments";
import {Users} from "../models/schemas/Users";
import {Notifies} from "../models/schemas/Notify";

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
    clients.push(newClient);

    const commentStream = Comments.watch();

    commentStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };

        const commentId = eventData.documentKey._id;
        const comment = await Comments.findById(commentId);
        const songId = comment?.song['_id'];                    ////////------------------------------- because comment was deleted

        const relatedComments = await Comments.find({song: songId})
            .populate({path: 'user', model: Users});

        clients.forEach(client => {
            if (client.id === songId?.toString()) {                    //-------------------------------------- so we cant find songId to send it to frontend
                client.res.write(`data: ${JSON.stringify({eventData, relatedComments, songId})}\n\n`)
            }
        });
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

    const clientId = req.params.playlistId;
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient);

    let relatedComments = await Comments.find({playlist: clientId})
        .populate({path: 'user', model: Users});

    if (newClient.id === clientId.toString()) {
        newClient.res.write(`data: ${JSON.stringify({relatedComments, clientId})}\n\n`);
    }

    const commentStream = Comments.watch();

    commentStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };

        const commentId = eventData.documentKey._id;
        const comment = await Comments.findById(commentId);
        const playlistId = comment.playlist['_id'];

        relatedComments = await Comments.find({playlist: clientId})
            .populate({path: 'user', model: Users});

        clients.forEach(client => {
            if (client.id === playlistId.toString()) {
                client.res.write(`data: ${JSON.stringify({eventData, relatedComments, clientId})}\n\n`)
            }
        });
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

    const client = await Users.findById(clientId)
        .populate({
            path: "notify",
            model: Notifies,
            populate: [
                {
                    path: "sourceUser",
                    model: Users
                },
                {
                    path: "entity",
                }
            ]
        });

    const allNotifyOfUser = client.notify;
    let userNeedNotify = [];
    userNeedNotify.push(client._id.toString());

    let data = `data: ${JSON.stringify({allNotifyOfUploader: allNotifyOfUser})}\n\n`;

    if (userNeedNotify.includes(newClient.id)) {
        newClient.res.write(`${data}`);
    }

    const notifyStream = Notifies.watch();

    notifyStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };

        const notifyId = eventData.documentKey._id;
        const notify = await Notifies.findById(notifyId);

        userNeedNotify = notify.userNeedToSendNotify;
        data = `data: ${JSON.stringify({eventData, allNotifyOfUploader: allNotifyOfUser})}\n\n`;
        allClient.forEach(client => {
            if (userNeedNotify.includes(client.id)) {
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