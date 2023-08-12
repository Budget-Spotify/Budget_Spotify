import {Schema, model} from "mongoose";

interface ITags {
    tagName: string
}

const tagSchema = new Schema<ITags>({
    tagName: String
});
export const Tags = model<ITags>('Tags', tagSchema, 'tags');