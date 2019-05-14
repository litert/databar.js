
export interface IConnectionOptions {

    /**
     * The hostname of remote server.
     */
    "host": string;

    /**
     * The port of remote server.
     */
    "port": number;

    /**
     * The username for authentication.
     */
    "username": string;

    /**
     * The password for authentication.
     */
    "password": string;

    /**
     * The charset to be used.
     */
    "charset"?: string;

    /**
     * The database to be used.
     */
    "database"?: string;

    /**
     * The timezone to be used.
     */
    "timezone"?: string;
}

export interface IPoolOptions extends IConnectionOptions {

    "pool": {

        /**
         * The maximum quantity of connections.
         */
        "maxConnections": number;

        /**
         * How many waiter could be in the connection waiting queue.
         */
        "maxQueueWaiters": number;

        /**
         * How long could wait for the connection.
         */
        "queueTimeout": number;
    };
}

export interface IFactory {

    createPool(opts: IPoolOptions): IPool;

    connect(opts: IConnectionOptions): Promise<IConnection>;
}

export interface IPool {

    pick(): Promise<IConnection>;

    close(): void;
}

export interface IExecutionResult {

    "affectedRows": number;

    "lastInsertId": number;
}

export interface IExecuteResult {

    "affectRows": number;

    "lastInsertId": number;
}

export interface IConnection {

    readonly connected: boolean;

    query<T>(
        sql: string,
        args?: Array<string | number | null>
    ): Promise<T[]>;

    execute(
        sql: string,
        args?: Array<string | number | null>
    ): Promise<IExecuteResult>;

    escape(str: string): string;

    close(): void;
}
