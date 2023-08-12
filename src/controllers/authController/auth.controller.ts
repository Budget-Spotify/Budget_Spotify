import {Users} from "../../models/schemas/Users";
import {RefreshTokens} from "../../models/schemas/RefreshToken";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Security} from "../../security/security";

export class AuthController {
    static async register(req: any, res: any) {
        const {firstName, lastName, username, password, phoneNumber, gender, avatar} = req.body;

        try {
            const existingUser = await Users.findOne({username});
            if (existingUser) {
                return res.status(400).json({message: 'User already exists!'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await Users.create({
                firstName,
                lastName,
                username,
                phoneNumber,
                gender,
                avatar,
                password: hashedPassword,
                role: 'user'
            });

            res.status(201).json({message: 'Sign up success!'});
        } catch (error) {
            res.status(500).json({message: 'Server error!'});
        }
    }

    static async googleRegister(req: any, res: any) {
        const {given_name, family_name, email, picture} = req.user;

        try {
            const existingUser = await Users.findOne({username: email});
            if (existingUser) {
                return;
            }

            await Users.create({
                firstName: given_name,
                lastName: family_name,
                username: email,
                phoneNumber: null,
                gender: null,
                avatar: picture,
                password: null,
                role: 'user'
            });
        } catch (e) {
            res.status(500).json({message: 'Server error!'}, e.message);
        }
    }

    static async login(req: any, res: any) {
        const {username, password} = req.body;
        try {
            const user = await Users.findOne({username});
            if (!user) {
                return res.status(404).json({message: 'Username does not exist!'});
            }

            if (req.authMethod !== 'google'){
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({message: 'Incorrect password!'});
                }
            }

            const accessToken = Security.accessToken(user);
            const refreshToken = Security.refreshToken(user);

            await RefreshTokens.create({
                refreshToken: refreshToken,
                user: user
            });

            res.status(200).json({
                message: 'Logged in successfully!',
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    _id: user._id,
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
            console.log(error)
            res.status(500).json({message: 'Server error!'});
        }
    }

    static reqRefreshToken(req: any, res: any, next: any) { // use to refresh token
        Security.reqRefreshToken(req, res, next)
            .then()
            .catch(e => {
                console.log(e)
            });
    }
}
