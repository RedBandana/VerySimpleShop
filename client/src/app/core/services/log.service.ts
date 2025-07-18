import { environment } from "../../../environments/environment";

const isProd: boolean = environment.production;

export class LogService {
    private currentClassName: string; // Property to hold the current class name

    constructor(className: string) {
        this.currentClassName = className;
    }

    public log(...args: any[]): void {
        if (isProd) return;
        this.outputLog(console.log, this.formatMessage('LOG', ...args));
    }

    public info(...args: any[]): void {
        this.outputLog(console.info, this.formatMessage('INFO', ...args));
    }

    public error(...args: any[]): void {
        this.outputLog(console.error, this.formatMessage('ERROR', ...args));
    }

    public warn(...args: any[]): void {
        this.outputLog(console.warn, this.formatMessage('WARN', ...args));
    }

    private formatMessage(level: string, ...args: any[]): string {
        return `[${level}][${this.currentClassName}] ${args.join(' ')}`;
    }

    private outputLog(logFunction: (msg?: any) => void, message: string): void {
        logFunction(message);
    }
}
