import {Schema, model} from "mongoose";

interface ISingers {
    singerName: string
}

const singerSchema = new Schema<ISingers>({
    singerName: String
});
export const Singers = model<ISingers>('Singers', singerSchema, 'singers');