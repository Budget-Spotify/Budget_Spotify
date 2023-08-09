import {Songs} from "../../models/schemas/Songs";
import {Users} from "../../models/schemas/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    static async deleteSong(req, res) {
        try {
            const song = await Songs.findOne({_id: req.body._id});
            const userId = req.user.id;
            if (!song) {
                const data = {
                    status: "failed",
                    message: 'Song does not exist!',
                }
                return res.status(404).json(data);
            }
            const uploaderId = song.uploader.toString();
            if (userId !== uploaderId) {
                const data = {
                    status: "failed",
                    message: 'This song does not belong to you!',
                }
                return res.status(403).json(data);
            }
            await Songs.deleteOne({_id: song._id});
            return res.status(200).json({
                status: "succeeded",
                message: 'The song has been deleted!'
            })
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async getSongs(req, res) {
        try {
            const userId = req.user.id;
            let songs = await Songs.find({uploader: userId}).sort({uploadTime: -1});
            if (songs.length > 0) {
                res.status(200).json({
                    status: 'succeeded',
                    songs: songs,
                });
            } else {
                res.status(200).json({
                    status: 'succeeded',
                    songs: [],
                    message: 'No data',
                });
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async getDetail(req, res) {
        try {
            let user = await Users.findOne({_id: req.body.id})
            if (!user) {
                res.status(404).json({
                    status: "failed",
                    message: "User does not Exist"
                })
            } else {
                res.status(200).json({
                    status: "succeeded",
                    user: user
                })
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async editPassword(req, res) {
        try {
            const user = await Users.findOne({_id: req.body.id});
            const {oldpassword, newpassword, newpasswordconfirm} = req.body;
            if (!user) {
                const data = {
                    status: "failed",
                    message: 'User does not exist!'
                }
                return res.json(data);
            }
            const isPasswordValid = await bcrypt.compare(oldpassword, user.password);
            if (!isPasswordValid) {
                const data = {
                    status: "failed",
                    message: 'Incorrect password!'
                }
                return res.json(data);
            }
            if (newpassword !== newpasswordconfirm) {
                const data = {
                    status: "failed",
                    message: "Incorrect password confirm!"
                }
                return res.json(data)
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
            user.password = hashedPassword
            await user.save()
            res.status(200).json({
                status: "succeeded",
                newPassword: user.password
            })
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async editInfo(req, res) {
        const user = await Users.findOne({_id: req.body.id});
        const {firstName, lastName, phoneNumber, gender, avatar} = req.body;
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: 'User does not exist!'
            });
        } else {
            user.firstName = firstName
            user.lastName = lastName
            user.phoneNumber = phoneNumber
            user.gender = gender
            user.avatar = avatar
            await user.save()
            res.status(200).json({
                status: "succeeded",
                userEdited: user
            })
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
