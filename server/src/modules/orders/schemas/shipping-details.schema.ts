import { Schema } from "mongoose";
import { AddressSchema, IAddress } from "src/common/schemas/address.schema";

export interface IShippingDetails {
    name: string;
    email: string;
    address: IAddress;
    carrier?: string;
    phone?: string;
    trackingNumber?: string;
}

export const ShippingDetailsSchema = new Schema<IShippingDetails>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: AddressSchema, required: true },
        carrier: { type: String },
        phone: { type: String },
        trackingNumber: { type: String },
    }
);
