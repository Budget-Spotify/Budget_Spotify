import express from 'express';
import { Comments } from "../models/schemas/Comments";

class SSERouter {
    router: express.Router;

    constructor() {
        this.router = express.Router();
        this.configureRoutes();
    }

    configureRoutes() {
        this.router.get('/events', (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            const commentStream = Comments.watch();

            commentStream.on('change', (change) => {
                const eventData = {
                    operationType: change.operationType,
                    documentKey: change.documentKey,
                    updatedFields: change.updateDescription?.updatedFields || null
                };

                res.write(`data: ${JSON.stringify(eventData)}\n\n`);
            });

            req.on('close', () => {
                commentStream.close()
                    .then(() => {
                        console.log('Comment stream closed');
                    })
                    .catch((error) => {
                        console.error('Error closing comment stream:', error);
                    });
            });
        });
    }
}

export default new SSERouter().router;