import {Schema, model} from "mongoose";

interface ISongs {
    songName: string;
    description: string;
    fileURL: string;
    avatar: string;
    uploadTime: string;
    singers: object[];
    composers: object[];
    tags: object[];
    uploader: object;
}

const songSchema = new Schema<ISongs>({
    songName: String,
    description: String,
    fileURL: String,
    avatar: String,
    uploadTime: String,
    singers: [{type: Schema.Types.ObjectId, ref: 'Singers'}],
    composers: [{type: Schema.Types.ObjectId, ref: 'Composers'}],
    tags: [{type: Schema.Types.ObjectId, ref: 'Tags'}],
    uploader: {type: Schema.Types.ObjectId, ref: 'Users'}
});
export const Songs = model<ISongs>('Songs', songSchema, 'songs');