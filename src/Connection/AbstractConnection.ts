import {Logger} from "winston";

export type OnError = (err: Error) => void;
export type ReconnectOptions = {
    timeout: number,
    attempts: number
};
export type AbstractConnectionOptions = {
    internalOptions?: {}
};
export default abstract class AbstractConnection
{
    private readonly _options: {};
    protected _connection: {};
    private readonly _logger: Logger;
    /**
     * Set after openBox(!), to prevent first 'mail' event, during openBox
     */
    private _connected: boolean;
    private _onError: OnError;
    private _reconnectOptions: ReconnectOptions;
    /**
     * Number of failed attempts made to connect the server.
     */
    private _attemptsMade: number;

    constructor(
        logger: Logger,
        options: {},
        reconnectOptions: ReconnectOptions = { timeout: 300, attempts: 3},
        onError: OnError = () => {}
    ) {
        this._logger = logger;
        this._options = options;
        this.connection = null;
        this.connected = false;
        this.attemptsMade = 0;
        this.reconnectOptions = {
            timeout: reconnectOptions.timeout,
            attempts: reconnectOptions.attempts
        };
        let callback  = async function (err: Error) {
            await this.connect().catch(onError);
        };
        this.onError = callback.bind(this);
    }

    get connected(): boolean {
        return this._connected;
    }

    set connected(value: boolean) {
        this._connected = value;
    }

    protected async sleep(ms: number): Promise<{}>
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    get onError(): OnError {
        return this._onError;
    }

    set onError(value: OnError) {
        this._onError = value;
    }

    isConnected(): boolean
    {
        return this.connection != null;
    }

    get connection(): any {
        return this._connection;
    }

    set connection(value: any) {
        this._connection = value;
    }

    get options(): {} {
        return this._options;
    }

    get reconnectOptions(): ReconnectOptions {
        return this._reconnectOptions;
    }

    set reconnectOptions(value: ReconnectOptions) {
        this._reconnectOptions = value;
    }

    get attemptsMade(): number {
        return this._attemptsMade;
    }

    set attemptsMade(value: number) {
        this._attemptsMade = value;
    }

    abstract makeConnection(): Promise<any>;

    abstract async onConnected(connection: any): Promise<any>;

    async connect(err?: Error): Promise<any>
    {
        let callback = (resolve, reject, attemptCount: number = 0) => {
            let [attempts, timeout] = [
                this.reconnectOptions.attempts,
                this.reconnectOptions.timeout
            ];
            this.makeConnection()
                .then((connect) => {
                    this.connection = connect;
                    this.onConnected(this.connection).then((connection) => {
                        this.connected = true;
                    });
                    this.logger.log('info', '['+this.constructor.name+'] Connected');
                    resolve(connect);
                })
                .catch((e) => {
                    this.logger.log('warn', '['+this.constructor.name+'] Try ...'+attemptCount);
                    if (attemptCount == attempts) {
                        reject(e);
                        return;
                    }
                    let timeoutPromise = new Promise(resolve => setTimeout(resolve, timeout));
                    timeoutPromise.then(() => {
                        callback(resolve, reject, ++attemptCount);
                    });
                });
        };
        return new Promise<any>(callback);
    }

    get logger(): Logger {
        return this._logger;
    }

    abstract async closeConnection(): Promise<void>;

}