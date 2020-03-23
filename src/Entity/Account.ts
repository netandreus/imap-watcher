export default class Account {
    private _id: number;
    private _service: string;
    private _name: string;
    private _email: string;
    private _password: string;
    private _imap_host: string;
    private _imap_port: number;
    private _imap_flags: string;
    private _smtp_host: string;
    private _smtp_port: number;
    private _is_active: boolean;
    private _created_at: string;

    constructor(
        id: number,
        service: string,
        name: string,
        email: string,
        password: string,
        imap_host: string,
        imap_port: number,
        imap_flags: string,
        smtp_host: string,
        smtp_port: number,
        is_active: boolean,
        created_at: string
    ) {
        this._id = id;
        this._service = service;
        this._name = name;
        this._email = email;
        this._password = password;
        this._imap_host = imap_host;
        this._imap_port = imap_port;
        this._imap_flags = imap_flags;
        this._smtp_host = smtp_host;
        this._smtp_port = smtp_port;
        this._is_active = is_active;
        this._created_at = created_at;
    }

    static fromDatabase(row: Record<string, string>): Account
    {
        return new Account(
            Number(row.id),
            row.service,
            row.name,
            row.email,
            row.password,
            row.imap_host,
            Number(row.imap_port),
            row.imap_flags,
            row.smtp_host,
            Number(row.smtp_port),
            Boolean(row.is_active),
            row.created_at
        );
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get service(): string {
        return this._service;
    }

    set service(value: string) {
        this._service = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get imapHost(): string {
        return this._imap_host;
    }

    set imapHost(value: string) {
        this._imap_host = value;
    }

    get imapPort(): number {
        return this._imap_port;
    }

    set imapPort(value: number) {
        this._imap_port = value;
    }

    get imapFlags(): string {
        return this._imap_flags;
    }

    set imapFlags(value: string) {
        this._imap_flags = value;
    }

    get smtpHost(): string {
        return this._smtp_host;
    }

    set smtpHost(value: string) {
        this._smtp_host = value;
    }

    get smtpPort(): number {
        return this._smtp_port;
    }

    set smtpPort(value: number) {
        this._smtp_port = value;
    }

    get isActive(): boolean {
        return this._is_active;
    }

    set isActive(value: boolean) {
        this._is_active = value;
    }

    get createdAt(): string {
        return this._created_at;
    }

    set createdAt(value: string) {
        this._created_at = value;
    }
}