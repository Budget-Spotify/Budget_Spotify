import {Songs} from "../../models/schemas/Songs";
import { Users } from "../../models/schemas/Users";
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
            let songs = await Songs.find();
            if (songs.length > 0) {
                res.status(200).json({
                    status: 'succeeded',
                    songs: songs
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
    static async getDetail(req,res){
       try{
        let user =await Users.findOne({_id:req.body.id})
        if(!user){
            res.status(404).json({
                status:"failed",
                message:"user is not Exist"
            })
        }else{
            res.status(200).json({
                status:"succeeded",
                user:user
            })
        }
       }catch(err){
        res.status(404).json({status: "failed", message: err.message});
       }
    }
}

export default UserController
