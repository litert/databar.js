// tslint:disable: no-console
import * as DB from "../lib";

(async () => {

    try {

        const factory = DB.createFactoryForMySQL2();

        const pool = await factory.createPool({
            host: "127.0.0.1",
            port: 3309,
            username: "root",
            password: "DashAdmin",
            database: "shop",
            charset: "utf8mb4",
            pool: {

                maxConnections: 10,
                maxQueueWaiters: 10,
                queueTimeout: 10000
            }
        });

        const conn = await pool.pick();

        console.log(await conn.query("SELECT * FROM metadata_groups;", []));

        conn.close();

        pool.close();
    }
    catch (e) {

        console.error(e.toJSON());
    }

})();
