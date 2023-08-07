import {Schema, model} from "mongoose";

interface IRefreshTokens {
    token: string,
    user: object
}

const refreshTokenSchema = new Schema<IRefreshTokens>({
  token: String,
  user: {type: Schema.Types.ObjectId, ref: 'Users'}
});

export const RefreshTokens = model<IRefreshTokens>('RefreshTokens', refreshTokenSchema, 'refreshTokens');