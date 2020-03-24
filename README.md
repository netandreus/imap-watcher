### IMAP Watcher
Watch IMAP events mail / update / expurge etc and reacts to it.

#### Installation
```
rm -rf ./node_modules
rm -rf ./yarn.lock
yarn install
```
Copy .env.dist to .env and enter your credentials, and set path to sync engine executable (https://github.com/netandreus/imap-sync).

#### Default output

Run command:

```yarn run interactive```

Output:
```
$ ./node_modules/.bin/ts-node src/index.ts
Started watcher...
[ DatabaseConnection ] Connected
Loaded 2 accounts
[ ImapConnection ] Connected
```