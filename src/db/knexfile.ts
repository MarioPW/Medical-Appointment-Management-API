import dotenv  from 'dotenv'

dotenv.config()

// module.exports = {
//     development: {
//         client: 'pg',
//         connection:  {
//             host: 'localhost',
//             port: 5432,
//             database: 'postgres',
//             user: 'postgres',
//             password: process.env.PWS
//         },
//         migrations:{
//             directory:'./migrations',
//             tableName: 'knex_migrations',
//         }
//     }
// }
// module.exports = {
//     development: {
//         client: 'postgresql',
//         connection: {
//             user: 'postgres',
//             password: process.env.PWS,
//             dabase: 'postgres',
//         },
//         migrations:{
//             tableName: 'knex_migrations'
//         }
//     }
// }
import { knex } from "knex";

if (!process.env.DB_PASSWORD) {
  throw new Error("⚠️ DB_PASSWORD no está definido en el archivo .env");
}

export const config = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD
  }
});

export default config;