import express from "express";
import cors from "cors";
import DatabaseConnect from "./src/models/database-connect";
import bodyParser from "body-parser";
import adminApiRouter from "./src/routers/admin.router";
import authRouter from "./src/routers/authRouter/authRouter";

const app = express();
const PORT = 8000

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
DatabaseConnect
    .connectDB()
    .then(res => console.log('Connect DB successfully!'))
    .catch(err => console.log('DB connect failed'));

app.use('/admin', adminApiRouter)
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
