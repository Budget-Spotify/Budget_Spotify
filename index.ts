import express from "express";
import cors from "cors";
import DatabaseConnect from "./src/models/database-connect";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
DatabaseConnect
    .connectDB()
    .then(res => console.log('Connect DB successfully!'))
    .catch(err => console.log('DB connect failed'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//aa