import { Schema, model } from "mongoose";
import Ikerdesek from "./kerdesek.interface";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

const kerdesekSchema = new Schema<Ikerdesek>(
    {
        _id: Number,
        kerdes: {
            type: String,
            required: true,
            unique: true,
        },
        valasz: {
            type: Number,
            required: true,
        },
        temakor: {
            ref: "temakorok",
            type: Number,
            required: true,
        },
        pont: {
            type: Number,
            required: true,
            min: [1, "Nem lehet nulla pont egy kérdés!"],
            max: [3, "Nem lehet egy kérdés 3 pontnál több!"],
        },
    },
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const kerdesekModel = model("kerdesek", kerdesekSchema, "kerdesek");

export default kerdesekModel;
