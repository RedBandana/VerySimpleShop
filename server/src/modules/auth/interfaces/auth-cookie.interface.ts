import { CookieOptions } from "express";

export interface IAuthCookie {
    name: string;
    token: string;
    options: CookieOptions;
}