import {Songs} from "../../models/schemas/Songs";

class UserController {
    static async addSong(req, res) {
        try {
            let {
                songName,
                description,
                fileURL,
                avatar,
                singers,
                composers,
                tags,
                uploader,
                isPublic
            }
                = req.body;
            let existingSong = await Songs.find({songName, uploader})
            if (existingSong.length > 0) {
                res.status(409).json({status: "failed", message: "Song already existed"})
            } else {
                let song = new Songs(req.body)
                await song.save()
                res.status(200).json({status: "succeeded", message: "Song added", song: song})
            }
        } catch (e) {
            res.status(404).json({status: "failed", message: e.message})
        }
    }

    static async getSongs(req, res) {
        try {
            let songs = await Songs.find().sort({uploadTime: -1});
            if (songs.length > 0) {
                res.status(200).json({
                    status: 'succeeded',
                    songs: songs,
                });
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'No data'
                });
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async getOneSong(req, res) {
        try {
            let songId = req.params.id;
            let song = await Songs.findOne({_id: songId});
            if (song) {
                res.status(200).json({
                    status: 'succeeded',
                    song: song
                })
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'No data'
                });
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }
}

export default UserController
