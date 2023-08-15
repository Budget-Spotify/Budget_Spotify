import express from 'express';
import {Comments} from "../models/schemas/Comments";
import {Users} from "../models/schemas/Users";

const sseRouter = express.Router();

sseRouter.get('/comment-on-song', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const initialComments = await Comments.find({}).populate({path: 'user', model: Users});
    res.write(`data: ${JSON.stringify({initialComments})}\n\n`);

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
        res.write(`data: ${JSON.stringify({eventData, relatedComments})}\n\n`);
    });

    req.on('close', () => {
        commentStream.close();
        console.log('Comment stream closed');
    });
});

export default sseRouter;