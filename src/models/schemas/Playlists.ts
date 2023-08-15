import { Schema, model } from "mongoose";

interface IPlaylists {
    uploader:object
    playlistName: string;
    avatar: string;
    uploadTime: string;
    description: string;
    songs: object[]
}

const playlistSchema = new Schema<IPlaylists>({
    uploader:{type:Schema.Types.ObjectId,ref:'Users'},
    playlistName: String,
    avatar: String,
    uploadTime: String,
    description: String,
    songs: [{ type: Schema.Types.ObjectId, ref: 'Songs' }]
});

export const Playlists = model<IPlaylists>('Playlists', playlistSchema, 'playlists');