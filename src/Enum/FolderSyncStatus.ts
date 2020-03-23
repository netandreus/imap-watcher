export enum FolderSyncStatus {
    NotSynced = 'not_synced',
    Syncing = 'syncing',
    SyncingNeedResync = 'syncing_need_resync',
    SyncedNeedResync = 'synced_need_resync',
    Synced = 'synced',
    Error = 'error'
}