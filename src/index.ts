/**
 * IMAP watcher server
 * @author Andrey Tokarchuk <netandreus@gmail.com>
 */
import "reflect-metadata";
import ImapConnection, {OnExpunge, OnMail, OnUpdate} from "./Connection/ImapConnection";
import {FolderSyncStatus} from "./Enum/FolderSyncStatus";
import Application from "./Services/Application";

/**
 * Init
 */
let application = Application.instance;
let logger = application.logger;

(async () => {
    await application.databaseConnection.connect().catch(application.shutdownHandler);
    let server = application.server;

    await server.loadAccounts();

    // Callbacks for events
    let onImapConnectionError = function (this: ImapConnection, err: Error) {
        logger.log('error', 'Can not connect to one ore more accounts. Server response: '+err.message);
        process.exit(1);
    };

    let markFoldersForResync = async function (connection: ImapConnection, folderNames: string[]) {
        let isAccountSyncing = await server.isAccountSyncing(connection.account);

        folderNames.map(async (folderName) => {
            if (isAccountSyncing) {
                let syncInfo = await server.getFolderSyncInfo(connection.account, folderName);
                if (syncInfo.sync_status == FolderSyncStatus.Synced) {
                    await server.updateFolderStatus(connection.account, folderName, FolderSyncStatus.SyncedNeedResync);
                } else if (syncInfo.sync_status == FolderSyncStatus.Syncing) {
                    await server.updateFolderStatus(connection.account, folderName, FolderSyncStatus.SyncingNeedResync);
                }
            } else {
                await connection.runSync(folderName);
            }
        });
    };

    let onMail: OnMail = async function (this: ImapConnection, numNewMail: number) {
        if (this.connected) {
            logger.log('info','There is '+numNewMail+' new message(s) in account '+this.account.email,{ type: 'event'});
            await markFoldersForResync(this,  ['INBOX']);
        }
    };

    let onUpdate: OnUpdate = async function (this: ImapConnection, seqno: any, info: any) {
        logger.log( 'info', '[ Event ] Update message seqno: '+seqno+' in account '+this.account.email,  { type: 'event'});
        let folderNames = await server.getAccountFolderNames(this.account);
        await markFoldersForResync(this, folderNames);
    };
    let onExpunge: OnExpunge = async function (this: ImapConnection, seqno: number) {
        logger.log('info', 'Expunge seqno: '+seqno+' in account '+this.account.email, { type: 'event'});
        let folderNames = await server.getAccountFolderNames(this.account);
        await markFoldersForResync(this, folderNames);
    };

    await server.connectToAllImaps(
        logger,
        onImapConnectionError,
        onMail,
        onUpdate,
        onExpunge,
        function (this: ImapConnection) { logger.log('info', 'IMAP ready'); },
        function (this: ImapConnection, message: string) {logger.log('info',  'IMAP alert');},
        function (this: ImapConnection, uidvalidity: number) {},
        function (this: ImapConnection, err: Error) { logger.log('error',  err.message); },
        function (this: ImapConnection, hadError: boolean) {logger.log( 'info',  'IMAP close. Had error: '+hadError);},
        function (this: ImapConnection) {logger.log( 'info',  'IMAP end');}
    );
    logger.log('info',  'Connected to '+server.imapConnections.length+' active imap servers.');

    // App exit handlers
    let onAppCloseHandler = async() => {
        await server.disconnectFromAllImaps((err: Error) => {logger.log('error',  err.message);});
        await server.dbConnection.closeConnection();
        logger.log('warn', 'Exit signal received. All connection closed.');
        process.exit(0);
    };
    process.on('SIGTERM', onAppCloseHandler)
        .on('SIGINT', onAppCloseHandler)
        .on('uncaughtException', onAppCloseHandler);
})();
logger.log('info', 'Started watcher...');

if (process.send) {
    process.send('ready');
}