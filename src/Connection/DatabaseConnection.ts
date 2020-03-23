import * as mysql from 'mysql2/promise';
import {Connection} from "types/mysql2/promise";
import AbstractConnection from "./AbstractConnection";
import {MysqlError} from "mysql";

export default class DatabaseConnection extends AbstractConnection {

    protected _connection: Connection;

    get connection(): Connection {
        return this._connection;
    }

    set connection(value: Connection) {
        this._connection = value;
    }

    async makeConnection(): Promise<Connection>
    {
        return mysql.createConnection(this.options);
    }

    async connect(err?: MysqlError): Promise<Connection>
    {
        return super.connect(err);
    }

    async closeConnection(): Promise<void>
    {
        if (this.connection) {
            await this.connection.end();
        }
        return Promise.resolve();
    }

    async onConnected(connection: Connection)
    {
        // Error, occurs after connection is established
        connection.on('error', this.onError);
    }

    async query(sql: string, values?: any | any[] | { [param: string]: any }): Promise<mysql.RowDataPacket[]>
    {
        if (values) {
            return await this.connection.query<mysql.RowDataPacket[]>(sql, values);
        } else {
            return await this.connection.query<mysql.RowDataPacket[]>(sql);
        }
    }
}