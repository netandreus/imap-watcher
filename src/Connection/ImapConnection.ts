import {ImapSimple, Message} from "imap-simple";
import Account from "../Entity/Account";
import {exec} from "ts-process-promises";
import {container} from "tsyringe";
import DatabaseConnection from "./DatabaseConnection";
import Server from "../Services/Server";
import AbstractConnection, {OnError} from "./AbstractConnection";
import {Connection} from "types/mysql2/promise";
let imaps = require('imap-simple');
// @see https://github.com/mscdex/node-imap#connection-events
export type OnMail = (numNewMail: number) => void;
export type OnUpdate = (seqno: any, info: any) => void;
export type OnExpunge = (seqno: number) => void;
export type OnReady = () => void;
export type OnAlert = (message: string) => void;
export type OnUidvalidity = (uidvalidity: number) => void;
export type OnClose = (hadError: boolean) => void;
export type OnEnd = () => void;

type ConnectionOptions = {
    imap: {
        user: string,
        password: string,
        host: string,
        port: number,
        tls: boolean,
        authTimeout: number
    }
};

export default class ImapConnection extends AbstractConnection
{
    protected _connection: ImapSimple;

    private _account: Account;
    private _onMail: OnMail;
    private _onUpdate: OnUpdate;
    private _onExpunge: OnExpunge;
    private _onReady: OnReady;
    private _onAlert: OnAlert;
    private _onUidvalidity: OnUidvalidity;
    private _onClose: OnClose;
    private _onEnd: OnEnd;

    get connection(): ImapSimple {
        return this._connection;
    }

    set connection(value: ImapSimple) {
        this._connection = value;
    }

    constructor(
        account: Account,
        tls: boolean,
        authTimeout: number,
        connTimeout: number,
        onMail?: OnMail,
        onUpdate?: OnUpdate,
        onExpunge?: OnExpunge,
        onReady?: OnReady,
        onAlert?: OnAlert,
        onUidvalidity?: OnUidvalidity,
        onError?: OnError,
        onClose?: OnClose,
        onEnd?: OnEnd
    ) {
        super(
            {
                imap: {
                    user: account.email,
                    password: account.password,
                    host: account.imapHost,
                    port: account.imapPort,
                    tls: tls, // tls: tls
                    tlsOptions: {
                        rejectUnauthorized: false
                    },
                    authTimeout: authTimeout,
                    connTimeout: connTimeout
                }
            },
            {
                timeout: 300,
                attempts: 3
            },
            onError? onError : () => {}
            );
        this.connected = false;
        this.account = account;

        this.onMail = onMail ? onMail : () => {};
        this.onMail = this.onMail.bind(this);

        this.onUpdate = onUpdate ? onUpdate : () => {};
        this.onUpdate = this.onUpdate.bind(this);

        this.onExpunge = onExpunge ? onExpunge : () => {};
        this.onExpunge = this.onExpunge.bind(this);

        this.onReady = onReady ? onReady : () => {};
        this.onReady = this.onReady.bind(this);

        this.onAlert = onAlert ? onAlert : () => {};
        this.onAlert = this.onAlert.bind(this);

        this.onUidvalidity = onUidvalidity ? onUidvalidity : () => {};
        this.onUidvalidity = this.onUidvalidity.bind(this);

        this.onClose = onClose ? onClose : () => {};
        this.onClose = this.onClose.bind(this);

        this.onEnd = onEnd ? onEnd : () => {};
        this.onEnd = this.onEnd.bind(this);

    }

    async makeConnection(): Promise<ImapSimple>
    {
        return imaps.connect(this.options);
    }

    async connect(err?: Error): Promise<ImapSimple>
    {
        return super.connect(err);
    }

    async onConnected(connection: ImapSimple)
    {
        // Add default listeners
        connection.on('close',  (hadError) => {
            this.connected = false;
        });
        // Add custom listeners
        connection.on('mail', this.onMail);
        connection.on('update', this.onUpdate);
        connection.on('expunge', this.onExpunge);
        connection.on('ready', this.onReady);
        connection.on('alert', this.onAlert);
        connection.on('uidvalidity', this.onUidvalidity);
        connection.on('error', this.onError);
        connection.on('close', this.onClose);
        connection.on('end', this.onEnd);

        // If we does not call openBox - we can't receive events.
        await connection.openBox('INBOX');
    }

    get onMail(): OnMail {
        return this._onMail;
    }

    set onMail(value: OnMail) {
        this._onMail = value;
    }

    get onExpunge(): OnExpunge {
        return this._onExpunge;
    }

    set onExpunge(value: OnExpunge) {
        this._onExpunge = value;
    }

    get onUpdate(): OnUpdate {
        return this._onUpdate;
    }

    set onUpdate(value: OnUpdate) {
        this._onUpdate = value;
    }

    get account(): Account {
        return this._account;
    }

    set account(value: Account) {
        this._account = value;
    }

    get onReady(): () => void {
        return this._onReady;
    }

    set onReady(value: () => void) {
        this._onReady = value;
    }

    get onAlert(): (message: string) => void {
        return this._onAlert;
    }

    set onAlert(value: (message: string) => void) {
        this._onAlert = value;
    }

    get onUidvalidity(): OnUidvalidity {
        return this._onUidvalidity;
    }

    set onUidvalidity(value: OnUidvalidity) {
        this._onUidvalidity = value;
    }

    get onClose(): OnClose {
        return this._onClose;
    }

    set onClose(value: OnClose) {
        this._onClose = value;
    }

    get onEnd(): OnEnd {
        return this._onEnd;
    }

    set onEnd(value: OnEnd) {
        this._onEnd = value;
    }

    async closeConnection(): Promise<void>
    {
        if (this.connection) {
            await this.connection.end();
            this.connected = false;
        }
        return Promise.resolve();
    }

    /**
     * @param email
     * @param folder
     */
    public async runSync(email?: string, folder?: string)
    {
        let command = process.env.SYNC_PATH + ' --once';
        if (email) {
            command += ' --email '+this.account.email;
        }
        if (folder) {
            command += ' --folder '+folder
        }
        await exec(command).on('process', (process) => {
            console.log('[ RUNNING ] SYNC pid = '+process.pid);
        }).then((result) => {
            console.log('[ COMPLETE ] Sync complete for '+email);
        }).error((error) => {
            console.log('[ ERROR ] ' + error);
        });
    }

}