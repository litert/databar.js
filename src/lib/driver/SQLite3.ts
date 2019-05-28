import * as SQLit3 from "sqlite3";
import * as C from "../Common";
import * as E from "../Errors";

class SQLit3Factory implements C.IFactory {

    private static _inited: boolean = false;

    public connect(opts: C.IConnectionOptions): Promise<C.IConnection> {

        const libSQLite3 = require("sqlite3");

        if (!SQLit3Factory._inited) {

            libSQLite3.verbose();
        }

        return new Promise<C.IConnection>((resolve, reject) => {

            const CDatabase = libSQLite3.Database;

            const db = new CDatabase(opts.host, (err: any) => {

                if (err) {

                    return reject(new E.E_CONNECT_FAILED({
                        message: err.message
                    }));
                }

                resolve(new SQLite3Connection(db, function() {db.close(); }));
            });
        });
    }

    public createPool(opts: C.IPoolOptions): C.IPool {

        throw new E.E_NO_POOLING();
    }
}

class SQLite3Connection implements C.IConnection {

    public readonly connected = true;

    public constructor(
        private _db: SQLit3.Database,
        public close: () => void
    ) {}

    public async query<T>(
        sql: string,
        args: Array<string | number | null> = []
    ): Promise<T[]> {

        return new Promise((resolve, reject) => {

            this._db.all(sql, args, function(err, rows) {

                if (err) {

                    return reject(err);
                }

                resolve(rows);
            });
        });
    }

    public async execute(
        sql: string,
        args: Array<string | number | null> = []
    ): Promise<C.IExecuteResult> {

        return new Promise((resolve, reject) => {

            this._db.run(sql, args, (err: any) => {

                if (err) {

                    switch (err.code) {

                    case "SQLITE_CONSTRAINT":

                        return reject(new E.E_DUP_CONSTRAINT({
                            message: err.message
                        }));

                    case "SQLITE_ERROR":

                        if (err.message.includes("syntax error")) {

                            return reject(new E.E_SYNTAX_ERROR({
                                message: err.message
                            }));
                        }
                        else if (err.message.includes("no such table")) {

                            return reject(new E.E_TABLE_NOT_FOUND({
                                message: err.message
                            }));
                        }
                        else if (err.message.includes("no column named")) {

                            return reject(new E.E_COLUMN_NOT_FOUND({
                                message: err.message
                            }));
                        }
                        else {

                            return reject(new E.E_QUERY_FAILED({
                                message: err.message
                            }));
                        }
                    }

                    return reject(err);
                }

                resolve({
                    affectRows: -1,
                    lastInsertId: -1
                });
            });
        });
    }

    public escape(str: string): string {

        return str.replace(/([\\'"])/g, "\\$1")
        .replace(/\u000d/g, "\\r")
        .replace(/\u000a/g, "\\n")
        .replace(/\u0000/g, "\\0")
        .replace(/\u001a/g, "\\Z")
        .replace(/\u0008/g, "\\b")
        .replace(/\u0009/g, "\\t")
        .replace(/\u0009/g, "\\t");
    }
}

export function createFactoryForSQLite3(): C.IFactory {

    return new SQLit3Factory();
}
