import {createLogger, format, Logger, transports} from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import dotEnv = require('dotenv');
import * as fs from "fs";
import DatabaseConnection from "../Connection/DatabaseConnection";
import {MysqlError} from "mysql";
import Server from "./Server";

export default class Application
{
    private static _instance: Application;
    private _logger: Logger;
    private _databaseConnection: DatabaseConnection;
    private _server: Server;
    private readonly _shutdownHandler: (err: Error) => void;

    private constructor()
    {
        this.initConfig();
        this.initLogger();
        this._shutdownHandler = function (err: MysqlError) {
            this.initLogger.log('error','[ Database ] Can not connect. Server error code: '+err.code+', Server response: '+err.message);
            process.exit(1);
        };
        this.initSyncExecutable(this.logger);
        this.initDatabaseConnection(this.logger);
        this.initServer(this.logger);
    }

    public static get instance()
    {
        return this._instance || (this._instance = new this());
    }

    private initConfig()
    {
        dotEnv.config();
    }

    private initSyncExecutable(logger: Logger)
    {
        /**
         * Check sync executable available
         */
        try {
            if (!fs.existsSync(process.env.WATCHER_SYNC_PATH)) {
                logger.log('error', 'Sync executable in path "'+process.env.WATCHER_SYNC_PATH+'" does not exists.'+
                    ' Please change WATCHER_SYNC_PATH in your .env file');
                process.exit(1);
            }
        } catch(err) {
            logger.log('error', JSON.stringify(err));
            process.exit(1);
        }
    }

    private initLogger()
    {
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

    public get logger(): Logger
    {
        return this._logger;
    }

    private initDatabaseConnection(logger: Logger)
    {
        // DatabaseConnection
        let mysqlOptions = {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        };
        this._databaseConnection =  new DatabaseConnection(logger, mysqlOptions, {
            attempts: Number(process.env.WATCHER_MAX_ATTEMPTS_COUNT),
            timeout:  Number(process.env.WATCHER_ATTEMPTS_TIMEOUT)
        }, this._shutdownHandler);
    }

    get databaseConnection(): DatabaseConnection {
        return this._databaseConnection;
    }

    private initServer(logger: Logger)
    {
        this._server = new Server(this._databaseConnection);
    }

    get server(): Server {
        return this._server;
    }

    get shutdownHandler(): (err: Error) => void {
        return this._shutdownHandler;
    }
}