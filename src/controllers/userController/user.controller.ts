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
                isPublic
            }
                = req.body;
            let existingSong = await Songs.find({songName, uploader})
            if (existingSong.length>0) {
                res.status(409).json({status: "failed", message: "Song already existed"})
            }
            else {
                let song = new Songs(req.body)
                await song.save()
                res.status(200).json({status: "succeeded", message: "Song added",song:song})
            }
        } catch (e) {
            res.status(404).json({status:"failed", message: e.message})
        }
    }
}

export default UserController