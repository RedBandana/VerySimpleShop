import { environment } from "../../../environments/environment";

const isProd = environment.production;

export function consoleLog(instance: any, ...args: any) {
    if (isProd) return;
    console.log(instance.constructor.name, ...args);
}

export function consoleError(...args: any) {
    if (isProd) return;
    console.error(...args);
}

export function consoleInfo(...args: any) {
    if (isProd) return;
    console.info(...args);
}

export function consoleWarn(...args: any) {
    if (isProd) return;
    console.warn(...args);
}
