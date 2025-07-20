import { Schema } from "mongoose";
import { INPUT_LENGTH } from "src/common/constants/input.constant";

export interface IAddress {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    state: string;
    postalCode: string;
}

export const AddressSchema = new Schema({
    line1: {
        type: String,
        required: true,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
    line2: {
        type: String,
        required: false,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
    city: {
        type: String,
        required: true,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
    state: {
        type: String,
        required: true,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
    country: {
        type: String,
        required: true,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
    postalCode: {
        type: String,
        required: true,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
});
