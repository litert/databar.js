// tslint:disable: no-console
import * as DB from "../lib";

(async () => {

    try {

        const factory = DB.createFactoryForMySQL2();

        const conn = await factory.connect({
            host: "127.0.0.1",
            port: 3309,
            username: "root",
            password: "DashAdmin",
            database: "shop",
            charset: "utf8mb4"
        });

        console.log(JSON.stringify(
            await conn.query("SELECT * FROM metadata_groups;", [])
        ));

        conn.close();
    }
    catch (e) {

        console.error(e.toJSON());
    }

})();
