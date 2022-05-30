// https://mongoosejs.com/docs/validation.html#built-in-validators

import { Schema, model } from "mongoose";
import Itemakorok from "./temakorok.interface";

const temakorokSchema = new Schema<Itemakorok>(
    {
        _id: Number,
        temakor: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const temakorokModel = model("temakorok", temakorokSchema, "temakorok");

export default temakorokModel;
