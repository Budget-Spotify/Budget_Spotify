import {Users} from "../../models/schemas/Users";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
    static async register(req: any, res: any) {
        const {firstName, lastName, username, password, phoneNumber, gender, avatar} = req.body;

        try {
            const existingUser = await Users.findOne({username});
            if (existingUser) {
                return res.status(400).json({message: 'User already exists!'});
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new Users({firstName, lastName, username, phoneNumber, gender, avatar, password: hashedPassword, role: 'user'});
            await newUser.save();

            res.status(201).json({message: 'Sign up success!'});
        } catch (error) {
            res.status(500).json({message: 'Server error!'});
        }
    }

    static async login(req: any, res: any) {
        const {username, password} = req.body;
        try {
            const user = await Users.findOne({username});
            if (!user) {
                return res.status(404).json({message: 'Username does not exist!'});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({message: 'Incorrect password!'});
            }

            const token = jwt.sign({userId: user._id}, '1234567890', {
                expiresIn: '3600',
            });

            res.status(200).json({
                message: 'Logged in successfully!',
                accessToken: token,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                    avatar: user.avatar,
                    playlist: user.playlist,
                    songsUploaded: user.songsUploaded
                }
            });
        } catch (error) {
            res.status(500).json({message: 'Server error!'});
        }
    }
}