import {Schema, model} from "mongoose";

export interface INotify {
    entityType: string;
    playlist: object | null;
    song: object | null;
    action: string;
    seen: boolean;
    sourceUser: object;
    userNeedToSendNotify: object[];
}

const notifySchema = new Schema<INotify>({
    entityType: String,
    playlist: {type: Schema.Types.ObjectId, ref: 'Playlists'} || {type: Schema.Types.ObjectId, ref: 'Songs'},
    song: {type: Schema.Types.ObjectId, ref: 'Songs'},
    action: String,
    seen: { type: Boolean, default: false },
    sourceUser: {type: Schema.Types.ObjectId, ref: 'Users'},
    userNeedToSendNotify: [{type: Schema.Types.ObjectId, ref: 'Users'}],
});

export const Notifies = model<INotify>('Notifies', notifySchema, 'notifies');