// tslint:disable: no-console
import * as DB from "../lib";

(async () => {

    try {

        const factory = DB.createFactoryForSQLite3();

        const conn = await factory.connect({
            host: "./test/users.db",
            port: 0,
            username: "",
            password: "",
        });

        await conn.execute(`CREATE TABLE IF NOT EXISTS users(
            id INT UNSIGNED NOT NULL,
            login_name CHAR(255) NOT NULL UNIQUE,
            password_hash CHAR(64) NOT NULL,
            password_key CHAR(16) NOT NULL,
            created_at BIGINT UNSIGNED NOT NULL
)`
        );

        const NOW = Date.now();

        await conn.execute(`INSERT OR IGNORE INTO users(
            id,
            login_name,
            password_hash,
            password_key,
            created_at
        ) VALUES(?, ?, ?, ?, ?)
        ON CONFLICT (login_name)
        DO UPDATE SET created_at = ?;`, [1, "admin", "aaaa", "cccc", NOW, NOW]);

        console.log(JSON.stringify(await conn.query("SELECT * FROM users;", [])));

        conn.close();
    }
    catch (e) {

        console.error(e.toJSON());
    }

})();
