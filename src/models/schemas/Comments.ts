import {Schema, model} from "mongoose";

interface IComments {
    song: object;
    user: object;
    uploadTime: string;
    content: string;
}

const commentSchema = new Schema<IComments>({
    song: {type: Schema.Types.ObjectId, ref: 'Songs'},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    uploadTime: String,
    content: String
});

export const Comments = model<IComments>('Comments', commentSchema, 'comments');