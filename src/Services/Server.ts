import DatabaseConnection from "../Connection/DatabaseConnection";
import Account from "../Entity/Account";
import {OnError} from "../Connection/AbstractConnection";
import ImapConnection, {OnExpunge, OnMail, OnUpdate, OnReady, OnAlert, OnUidvalidity, OnClose, OnEnd} from "../Connection/ImapConnection";
import {ImapSimple} from "imap-simple";
import * as os from "os";

export type SyncingInfo = {
    sync_status: string,
    sync_host: string,
    sync_pid: number
};

export default class Server
{
    private _dbConnection: DatabaseConnection;
    private _accounts: Account[];
    private _imapConnections: ImapConnection[];

    constructor(dbConnection: DatabaseConnection) {
        this.dbConnection = dbConnection;
        this.imapConnections = [];
    }

    async loadAccounts(): Promise<Account[]>
    {
        let [rows, fields] = await this.dbConnection.query('SELECT * FROM accounts WHERE is_active = 1');
        this._accounts = rows.map((row: Record<string, string> ) => {
            return Account.fromDatabase(row);
        });
        return this._accounts;
    }

    async connectToAllImaps(
        onConnectionError: OnError,
        onMail?: OnMail,
        onUpdate?: OnUpdate,
        onExpunge?: OnExpunge,
        onReady?: OnReady,
        onAlert?: OnAlert,
        onUidvalidity?: OnUidvalidity,
        onError?: OnError,
        onClose?: OnClose,
        onEnd?: OnEnd
    ): Promise<any>
    {
        let promises: Promise<ImapSimple>[];
        this.imapConnections = this.accounts.map((account: Account) => {
            if (account.isActive) {
                return new ImapConnection(
                    account,
                    Boolean(process.env.MAIL_TLS),
                    Number(process.env.MAIL_AUTH_TIMEOUT),
                    Number(process.env.MAIL_CONN_TIMEOUT),
                    onMail,
                    onUpdate,
                    onExpunge,
                    onReady,
                    onAlert,
                    onUidvalidity,
                    onError,
                    onClose,
                    onEnd
                );
            }
        });
        promises = this.imapConnections.map((connection: ImapConnection) => {
            return connection.connect();
        });
        await Promise.all(promises).catch(onConnectionError);
    }

    get accounts(): Account[] {
        return this._accounts;
    }

    set accounts(value: Account[]) {
        this._accounts = value;
    }


    get dbConnection(): DatabaseConnection {
        return this._dbConnection;
    }

    set dbConnection(value: DatabaseConnection) {
        this._dbConnection = value;
    }

    get imapConnections(): ImapConnection[] {
        return this._imapConnections;
    }

    set imapConnections(value: ImapConnection[]) {
        this._imapConnections = value;
    }

    async getFolderSyncInfo(account: Account, folder: string): Promise<SyncingInfo>
    {
        let [rows, fields] = await this.dbConnection.query(
            "SELECT sync_status, sync_host, sync_pid FROM folders WHERE account_id = ? AND name = ?",
            [account.id, folder]
        );
        return rows[0];
    }

    /**
     * Is some folder of this account is syncing now?
     * @param account
     */
    async isAccountSyncing(account: Account): Promise<boolean>
    {
        let sql =
            "SELECT COUNT(id) as syncing_folders_count " +
            "FROM `folders` " +
            "WHERE account_id = ? AND sync_status IN ('syncing', 'syncing_need_resync')";
        let [rows, fields] = await this.dbConnection.query(sql, [account.id]);
        let count = rows[0]['syncing_folders_count'];
        return (count > 0)? true : false;
    }

    async updateFolderStatus(account: Account, folder: string, status: string): Promise<void>
    {
        let sql = "UPDATE `folders` SET sync_status = ? WHERE account_id = ? AND name = ?";
        await this.dbConnection.query(sql, [status, account.id, folder]);
    }

    async getAccountFolderNames(account: Account): Promise<string[]>
    {
        let sql =
            "SELECT name " +
            "FROM `folders` " +
            "WHERE account_id = ?";
        let [rows, fields] = await this.dbConnection.query(sql, [account.id]);
        return rows.map((row) => {
            return row['name'];
        });
    }
}