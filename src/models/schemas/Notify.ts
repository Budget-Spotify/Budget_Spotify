import {Schema, model} from "mongoose";

interface INotify {
    entityType: string;
    playlist: object | null;
    song: object | null;
    action: string;
    seen: boolean;
    source: object;
}

const notifySchema = new Schema<INotify>({
    entityType: String,
    playlist: {type: Schema.Types.ObjectId, ref: 'Playlists'} || {type: Schema.Types.ObjectId, ref: 'Songs'},
    song: {type: Schema.Types.ObjectId, ref: 'Songs'},
    action: String,
    seen: { type: Boolean, default: false },
    source: {type: Schema.Types.ObjectId, ref: 'Users'},
});

export const Notifies = model<INotify>('Notifies', notifySchema, 'notifies');