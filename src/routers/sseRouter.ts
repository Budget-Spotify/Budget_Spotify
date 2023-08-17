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

    const commentStream = Comments.watch();

    commentStream.on('change', async (change) => {
        const eventData = {
            operationType: change.operationType,
            documentKey: change.documentKey,
            updatedFields: change.updateDescription?.updatedFields || null
        };
        const commentId = eventData.documentKey._id;
        const comment = await Comments.findById(commentId);
        const songId = comment?.song['_id'];

        const relatedComments = await Comments.find({song: songId})
            .populate({path: 'user', model: Users});
        clients.forEach(client=>{
            if(client.id === req.params.songId) client.res.write(`data: ${JSON.stringify({eventData, relatedComments, songId})}\n\n`);
        })
    });

    req.on('close', () => {
        console.log(`${clientId} - Connection closed`);
        commentStream.close()
        clients = clients.filter(client => client.id !== clientId);
    });
});

export default sseRouter;