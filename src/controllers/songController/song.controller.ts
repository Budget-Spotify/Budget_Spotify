import { Singers } from "../../models/schemas/Singers";
import { Composers } from "../../models/schemas/Composers";
import { Tags } from "../../models/schemas/Tags";
import { Songs } from "../../models/schemas/Songs";

export class SongController {
    static async getPublicSongs(req, res) {
        try {
            let songs = await Songs.find({ isPublic: true }).sort({ uploadTime: -1 });
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
            res.status(404).json({ status: "failed", message: err.message });
        }
    }
    static async searchSongPublic(req: any, res: any) {
        try {
            const songName = req.query.songName;
            if (songName) {
                const foundSongs = await Songs.find({
                    songName: { $regex: new RegExp(songName, 'i') },
                    isPublic: true
                }).sort({ uploadTime: -1 });
                res.status(200).json({
                    status: 'succeeded',
                    songs: foundSongs,
                });
            } else {
                let songs = await Songs.find({ isPublic: true }).sort({ uploadTime: -1 });
                if (songs.length > 0) {
                    res.status(200).json({
                        status: 'succeeded',
                        songs: songs,
                    });
                }else {
                    res.status(404).json({
                        status: 'failed',
                        message: 'No data'
                    });
                }
            }
        } catch (e) {
            res.status(404).json({ message: e })
        }
    }
    static async getRandomSong(req,res){
        try{
            let randomSong = await Songs.aggregate([
                { $match: { isPublic: true } },
                { $sample: { size: 1 } }
              ]);
            res.status(200).json({
                status: 'succeeded',
                data: randomSong[0]
            })
        } catch (err){
            res.status(404).json({
                status: 'failed',
                message: err.message
            });
        }
    }
    static async getSingers(req,res){
        try{
            let singers = await Singers.find({})
            res.status(200).json({
                status: 'succeeded',
                data: singers
            })
        } catch(err){
            res.status(404).json({
                status: 'failed',
                message: err.message
            })
        }
    }
    static async getComposers(req,res){
        try{
            let composers = await Composers.find({})
            res.status(200).json({
                status: 'succeeded',
                data: composers
            })
        } catch(err){
            res.status(404).json({
                status: 'failed',
                message: err.message
            })
        }
    }
    static async getTags(req,res){
        try{
            let tags = await Tags.find({})
            res.status(200).json({
                status: 'succeeded',
                data: tags
            })
        } catch(err){
            res.status(404).json({
                status: 'failed',
                message: err.message
            })
        }
    }
}