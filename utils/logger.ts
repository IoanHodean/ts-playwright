import { format } from 'util';
import fs from 'fs';
import path from 'path';

enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

const LOG_LEVELS = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3
};

class Logger {
    private static instance: Logger;
    private isDebug: boolean;
    private logFile: string;
    private minLevel: LogLevel;

    private constructor() {
        this.isDebug = process.env.DEBUG === 'true';
        this.minLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
        
        // Setup log file
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        this.logFile = path.join(logsDir, `test-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
    }

    private log(level: LogLevel, message: string, ...args: any[]): void {
        if (!this.shouldLog(level)) return;

        const timestamp = new Date().toISOString();
        const formattedMessage = format(message, ...args);
        const logMessage = `[${timestamp}] [${level}] ${formattedMessage}`;

        // Console output
        console.log(logMessage);

        // File output
        fs.appendFileSync(this.logFile, logMessage + '\n');
    }

    debug(message: string, ...args: any[]): void {
        if (this.isDebug) {
            this.log(LogLevel.DEBUG, message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        this.log(LogLevel.INFO, message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        this.log(LogLevel.WARN, message, ...args);
    }

    error(message: string, ...args: any[]): void {
        this.log(LogLevel.ERROR, message, ...args);
    }

    getLogFilePath(): string {
        return this.logFile;
    }
}

export const logger = Logger.getInstance(); 