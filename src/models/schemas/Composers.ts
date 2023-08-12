import {Schema, model} from "mongoose";

interface IComposers {
    composerName: string
}

const composerSchema = new Schema<IComposers>({
    composerName: String
});
export const Composers = model<IComposers>('Composers', composerSchema, 'composers');