import express from 'express';
import {Comments} from "../models/schemas/Comments";
import {Users} from "../models/schemas/Users";

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
    console.log(`${clientId} connected`);

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
        clients.forEach(client=>{
            if(client.id === songId.toString()) {
                let clientIDs = clients.map(client=>client.id)
                console.log(clientIDs);
                console.log(`send res to ${client.id}`);
                console.log(`current song's ID is ${songId.toString()}`);
                client.res.write(`data: ${JSON.stringify({eventData, relatedComments, songId})}\n\n`)
            };
        })
    });

    req.on('close', () => {
        console.log(`${clientId} - Connection closed`);
        commentStream.close()
        clients = clients.filter(client => client.id !== clientId);
    });
});
sseRouter.get('/comment-on-playlist/:playlistId', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    let playlistId=req.params.playlistId
    let relatedComments = await Comments.find({playlist: playlistId})
    .populate({path: 'user', model: Users});
    res.write(`data: ${JSON.stringify({ relatedComments,  playlistId})}\n\n`);
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

export default sseRouter;