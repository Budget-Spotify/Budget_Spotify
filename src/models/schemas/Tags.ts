import {Schema, model} from "mongoose";

interface ITags {
    singerName: string
}

const tagSchema = new Schema<ITags>({
    singerName: String
});
export const Tags = model<ITags>('Tags', tagSchema, 'tags');