import * as MySQL2 from "mysql2/promise";
import * as C from "../Common";
import * as E from "../Errors";

class MySQL2Factory implements C.IFactory {

    public createPool(opts: C.IPoolOptions): C.IPool {

        return new MySQL2Pool(MySQL2.createPool({
            "host": opts.host,
            "port": opts.port,
            "user": opts.username,
            "password": opts.password,
            "timezone": opts.timezone,
            "database": opts.database,
            "charset": opts.charset,
            "acquireTimeout": opts.pool.queueTimeout,
            "connectionLimit": opts.pool.maxConnections,
            "waitForConnections": true,
            "queueLimit": opts.pool.maxQueueWaiters,
        }));
    }

    public async connect(opts: C.IConnectionOptions): Promise<C.IConnection> {

        try {

            const conn = await MySQL2.createConnection({
                "host": opts.host,
                "port": opts.port,
                "user": opts.username,
                "password": opts.password,
                "timezone": opts.timezone,
                "database": opts.database,
                "charset": opts.charset
            });

            return new MySQL2Connection(conn, () => conn.end());
        }
        catch (e) {

            throw new E.E_CONNECT_FAILED({
                message: e.message,
                metadata: {
                    code: e.code
                }
            });
        }
    }
}

class MySQL2Connection implements C.IConnection {

    constructor(
        private _conn: MySQL2.Connection,
        public close: () => void,
        public connected: boolean = true
    ) { }

    public escape(str: string): string {

        return this._conn.escape(str);
    }

    public async query<T>(
        sql: string,
        args: Array<string | number | null> = []
    ): Promise<T[]> {

        try {

            const [result] = await this._conn.query(sql, args);

            if (Array.isArray(result)) {

                return result as T[];
            }
            else {

                return [];
            }
        }
        catch (err) {

            switch (err.errno) {
            case 1064:

                throw new E.E_SYNTAX_ERROR({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });

            case 1062:

                throw new E.E_DUP_CONSTRAINT({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });

            case 1146:

                throw new E.E_TABLE_NOT_FOUND({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });

            case 1054:

                throw new E.E_COLUMN_NOT_FOUND({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });
            }

            throw new E.E_QUERY_FAILED({
                "message": err.message,
                "metadata": {
                    "code": err.code,
                    "sqlMessage": err.sqlMessage,
                    "sqlState": err.sqlState
                }
            });
        }
    }

    public async execute(
        sql: string,
        args: Array<string | number | null> = []
    ): Promise<C.IExecuteResult> {

        try {

            const result = (await this._conn.query(sql, args))[0] as MySQL2.OkPacket;

            return {
                "affectRows": result.affectedRows || 0,
                "lastInsertId": result.insertId || undefined as any
            };
        }
        catch (err) {

            switch (err.errno) {
            case 1064:

                throw new E.E_SYNTAX_ERROR({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });

            case 1062:

                throw new E.E_DUP_CONSTRAINT({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });

            case 1146:

                throw new E.E_TABLE_NOT_FOUND({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });

            case 1054:

                throw new E.E_COLUMN_NOT_FOUND({
                    "message": err.message,
                    "metadata": {
                        "code": err.code,
                        "sqlMessage": err.sqlMessage,
                        "sqlState": err.sqlState
                    }
                });
            }

            throw new E.E_QUERY_FAILED({
                "message": err.message,
                "metadata": {
                    "code": err.code,
                    "sqlMessage": err.sqlMessage,
                    "sqlState": err.sqlState
                }
            });
        }
    }
}

class MySQL2Pool implements C.IPool {

    constructor(
        private _pool: MySQL2.Pool
    ) { }

    public async pick(): Promise<C.IConnection> {

        try {

            const conn = await this._pool.getConnection();
            return new MySQL2Connection(conn, () => conn.release());
        }
        catch (e) {

            throw new E.E_CONNECT_FAILED({
                metadata: {
                    code: e.code
                }
            });
        }
    }

    public close(): void {

        this._pool.end();
    }
}

export function createFactoryForMySQL2(): C.IFactory {
    return new MySQL2Factory();
}
