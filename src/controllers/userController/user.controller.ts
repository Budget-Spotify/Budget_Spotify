import {Songs} from "../../models/schemas/Songs";

class UserController {
    static async addSong(req, res) {
        try {
            let {
                songName,
                description,
                fileURL,
                avatar,
                uploadTime,
                singers,
                composers,
                tags,
                uploader,
                isPublished
            }
                = req.body;
            let existingSong = await Songs.find({songName, singers, composers})
            if (existingSong) res.status(409).json({status: "failed", message: "Song already existed"})
            else res.status(200).json({status: "succeeded", message: "Song added"})
        } catch (e) {
            res.status(404).json({status:"failed", message: e.message})
        }
    }
}

export default UserController