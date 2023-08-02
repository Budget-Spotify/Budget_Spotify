import {Schema, model} from "mongoose";

interface IUsers {
    username: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    avatar: string;
    playlist: object[];
    songsUploaded: object[];

}

const userSchema = new Schema<IUsers>({
    username: String,
    password: String,
    role: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    gender: String,
    avatar: String,
    playlist: [{type: Schema.Types.ObjectId, ref: 'Playlists'}],
    songsUploaded: [{type: Schema.Types.ObjectId, ref: 'Songs'}]
});

export const Users = model<IUsers>('Users', userSchema, 'users');