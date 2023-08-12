import {Schema, model} from "mongoose";

interface IComposers {
    singerName: string
}

const composerSchema = new Schema<IComposers>({
    singerName: String
});
export const Composers = model<IComposers>('Composers', composerSchema, 'composers');