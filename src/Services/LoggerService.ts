import {createLogger, format, Logger, transports} from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import {Service} from "typedi";

@Service()
export default class LoggerService {
    private _logger: Logger;

    constructor() {
        let templateFunction = (info) => {
            let label = (info['0'] && info['0'].label)? info['0'].label : null;
            return `${info.timestamp} ${info.level}:` + (label ? ` [ ${label} ]` : ``) + ` ${info.message}`;
        };
        this._logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                format.printf(templateFunction)
            ),
            defaultMeta: { service: 'imap-watcher' },
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                        format.colorize(),
                        format.printf(templateFunction)
                    )
                }),
                new DailyRotateFile({
                    filename: process.env.WATCHER_ERROR_LOG_PATH+'/imap-watcher-%DATE%.log',
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                })
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