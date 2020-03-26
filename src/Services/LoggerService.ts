import {createLogger, format, LogEntry, Logger, LoggerOptions, LogMethod, transports} from "winston";
import {Service} from "typedi";

@Service()
export default class LoggerService {
    private _logger: Logger;

    constructor() {
        this._logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                format.colorize(),
                format.printf((info) => {
                    let label = (info['0'] && info['0'].label)? info['0'].label : null;
                    return `${info.timestamp} ${info.level}:` + (label ? ` [ ${label} ]` : ``) + ` ${info.message}`;
                })
            ),
            defaultMeta: { service: 'imap-watcher' },
            transports: [
                new transports.Console(),
                new transports.File({ filename: process.env.WATCHER_ERROR_LOG_PATH })
            ]
        });
    }

    get logger() {
        return this._logger;
    }

    set logger(value) {
        this._logger = value;
    }

    log(level: string, message: string, ...meta: any[]) {
        this.logger.log(level, message, meta);
        return this;
    }
}