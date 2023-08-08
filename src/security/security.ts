import security from 'jsonwebtoken';
import jwt from "jsonwebtoken";
import {RefreshTokens} from "../models/schemas/RefreshToken";
import {Users} from "../models/schemas/Users";

export class Security {
    private static jwtSecretKey: string = '123456';
    private static JwtRefreshKey: string = '123456';
    static accessToken(user) {
        return jwt.sign({
                id: user._id,
                role: user.role
            },
            Security.jwtSecretKey,
            {expiresIn: "5m"}
        );
    }

    static refreshToken(user) {
        return jwt.sign({
                id: user._id,
                role: user.role
            },
            Security.JwtRefreshKey,
            {expiresIn: "5m"}
        );
    }

    static verifyToken(req: any, res: any, next: any) { // use like middleware to verify login or not
        const token = req.headers.token;
        const accessToken = token.split(" ")[1] // variable token include "Bearer + token" so i need delete Bearer
        if (accessToken !== "null") {
            try {
                req.user = jwt.verify(accessToken, Security.jwtSecretKey);
                next();
            } catch (e) {
                res.status(403).json("Editing token is useless");
            }
        } else {
            res.status(401).json("You are not authenticated");
        }
    }

    static async reqRefreshToken(req: any, res: any, next: any) { // use Redis and DB instead of refreshTokenList
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You are not authenticated");
        }

        const existingRefreshToken = await RefreshTokens.findOne({refreshToken});
        if (existingRefreshToken) {
            return res.status(403).json("Refresh token is not valid");
        }

        jwt.verify(refreshToken, Security.JwtRefreshKey, async (err: any, user) => {
            if (err) {
                console.log(err);
            }
            await RefreshTokens.deleteOne({token: refreshToken});
            const newAccessToken = Security.accessToken(user);
            const newRefreshToken = Security.refreshToken(user);
            res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken});
        })
    }

    static checkAdmin(req : any, res: any, next: any) {
        console.log(req.user.role)
        req.user.role === 'admin' ? next() : res.status(403).json("Only admin can do that");
    }
}
