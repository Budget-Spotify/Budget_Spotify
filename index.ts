import express from "express";
import cors from "cors";
import DatabaseConnect from "./src/models/database-connect";
import bodyParser from "body-parser";
import adminApiRouter from "./src/routers/adminRouter/admin.router";
import authRouter from "./src/routers/authRouter/authRouter";
import userRouter from "./src/routers/userRouter/userRouter";
import songRouter from "./src/routers/songRouter/songRouter";

const app = express();
const PORT = 8000

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());

app.get('/events', (req, res) => { // may be can use like router
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(() => {
        const currentTime = new Date().toLocaleTimeString(); // data need to transport
        res.write(`data: ${currentTime}\n\n`);  // the way transport data
    }, 1000);

    req.on('close', () => {
        clearInterval(interval);
    });
});

DatabaseConnect
    .connectDB()
    .then(res => console.log('Connect DB successfully!'))
    .catch(err => console.log('DB connect failed'));

app.use('/admin', adminApiRouter)
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/song', songRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});