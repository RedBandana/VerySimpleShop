import { CookieOptions } from "express";

export interface AuthCookie {
    name: string;
    token: string;
    options: CookieOptions;
}