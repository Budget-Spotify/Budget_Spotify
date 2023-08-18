import {Schema, model} from "mongoose";

interface INotify {
    entityType: string;
    playlist: object | null;
    song: object | null;
    action: string;
}

const notifySchema = new Schema<INotify>({
    entityType: String,
    playlist: {type: Schema.Types.ObjectId, ref: 'Playlists'},
    song: {type: Schema.Types.ObjectId, ref: 'Songs'},
    action: String,
});

export const Notifies = model<INotify>('Notifies', notifySchema, 'notifies');