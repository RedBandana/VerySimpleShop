import { Schema } from "mongoose";
import { INPUT_LENGTH } from "src/common/constants/input.constant";

export interface IAddress {
    streetAddress01: string;
    streetAddress02: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
}

export const AddressSchema = new Schema({
    streetAddress01: {
        type: String,
        required: true,
        minlength: INPUT_LENGTH.TEXT.MIN,
        maxlength: INPUT_LENGTH.TEXT.MAX,
    },
    streetAddress02: {
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
    province: {
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
