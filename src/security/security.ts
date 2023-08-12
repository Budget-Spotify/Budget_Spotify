import jwt from "jsonwebtoken";
import {RefreshTokens} from "../models/schemas/RefreshToken";
import {OAuth2Client} from 'google-auth-library';
import {AuthController} from "../controllers/authController/auth.controller";

export class Security {
    private static jwtSecretKey: string = '123456';
    private static JwtRefreshKey: string = '123456';

    static accessToken(user: any) {
        return jwt.sign({
                id: user._id,
                role: user.role
            },
            Security.jwtSecretKey,
            {expiresIn: "5h"}
        );
    }

    static refreshToken(user: any   ) {
        return jwt.sign({
                id: user._id,
                role: user.role
            },
            Security.JwtRefreshKey,
            {expiresIn: "5h"}
        );
    }

    static async googleLogin(req: any, res: any, next: any) {
        const idToken = req.body.token;
        const clientId = "683585484602-h399cig7631kcaq65kpn1a3nva3mco5m.apps.googleusercontent.com";
        try {
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({
                idToken,
                audience: clientId
            });
            req.authMethod = "google";
            req.body = ticket.getPayload();
            await AuthController.register(req, res);
            req.body = {username: req.body.email, password: null};
            await AuthController.login(req, res);
        } catch (e) {
            res.status(401).json('Google token verification failed', e.message);
        }
    }

    static verifyToken(req: any, res: any, next: any) {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json("You are not authenticated");
        }

        const accessToken = token.split(" ")[1];
        try {
            req.user = jwt.verify(accessToken, Security.jwtSecretKey);
            req.authMethod = "jwt";
            next();
        } catch (e) {
            res.status(401).json("Token Invalid", e.message);
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

        jwt.verify(refreshToken, Security.JwtRefreshKey, async (err: any, user: any) => {
            if (err) {
                console.log(err);
            }
            await RefreshTokens.deleteOne({token: refreshToken});
            const newAccessToken = Security.accessToken(user);
            const newRefreshToken = Security.refreshToken(user);
            res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken});
        })
    }

    static checkAdmin(req: any, res: any, next: any) {
        req.user.role === 'admin' ? next() : res.status(403).json("Only admin can do that");
    }
}
